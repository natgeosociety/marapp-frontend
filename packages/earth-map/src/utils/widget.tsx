/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import concat from 'lodash/concat';
import find from 'lodash/find';
import forOwn from 'lodash/forOwn';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import mean from 'lodash/mean';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import upperCase from 'lodash/upperCase';
import moment from 'moment';

export const parseObject = (str) => {
  const out = {};
  str = str.replace(/[{|}]/g, '').split(', ');
  str.forEach((v) => {
    const [key, value] = v.split('=>');
    out[key] = parseFloat(value);
  });
  return out;
};

// STATISTICS
export function getStats(data, startDate, endDate) {
  if (!data) {
    return null;
  }

  const DATA = data.year_isoweek;
  // @ts-ignore
  const latestYear = maxBy(DATA, 'year').year;
  // todo this
  const latestWeek = maxBy(
    DATA.filter((d) => d.year === latestYear),
    'isoweek'
    // @ts-ignore
  ).isoweek;

  const orderByDate = orderBy(DATA, ['year', 'isoweek']);
  const means = getMeansData(orderByDate, latestWeek);
  const stats = getStdDevData(means, orderByDate);

  const parsedData = getDates(stats);

  return parsedData;
}

const getMeansData = (data, latest) => {
  // @ts-ignore
  const minYear = minBy(data, 'year').year;
  // @ts-ignore
  const maxYear = maxBy(data, 'year').year;
  const grouped = groupBy(data, 'isoweek');
  const centralMeans = Object.keys(grouped).map((d) => {
    const weekData = grouped[d];
    return meanBy(weekData, 'value');
  });
  const leftYears = data.filter((d) => d.year !== maxYear);
  const rightYears = data.filter((d) => d.year !== minYear);
  // @ts-ignore
  const leftMeans = meanData(getYearsObj(leftYears, -6));
  const rightMeans = meanData(getYearsObj(rightYears, 0, 6));
  const allMeans = concat(leftMeans, centralMeans, rightMeans);
  const smoothedMeans = runningMean(allMeans, 12);
  const translatedMeans = translateMeans(smoothedMeans, latest);
  const pastYear = data.slice(-52);
  const parsedData = pastYear.map((d, i) => ({
    ...d,
    mean: translatedMeans[i],
  }));
  return parsedData;
};

const getStdDevData = (data, rawData) => {
  const stdDevs = [];
  const centralMeans = data.map((d) => d.mean);
  const groupedByYear = groupBy(rawData, 'year');
  const meansFromGroup = Object.keys(groupedByYear).map((key) =>
    groupedByYear[key].map((d) => d.value)
  );
  for (let i = 0; i < centralMeans.length; i += 1) {
    meansFromGroup.forEach((m) => {
      const value = m[i] || 0;
      const some = value && centralMeans[i] ? (centralMeans[i] - value) ** 2 : null;
      stdDevs[i] = stdDevs[i] ? [...stdDevs[i], some] : [some];
    });
  }
  const stdDev = mean(stdDevs.map((s) => mean(s) ** 0.5));
  return data.map((d) =>
    fillDescription({
      ...d,
      plusStdDev: [d.mean, d.mean + stdDev],
      minusStdDev: [d.mean - stdDev, d.mean],
      twoPlusStdDev: [d.mean + stdDev, d.mean + stdDev * 2],
      twoMinusStdDev: [d.mean - stdDev * 2, d.mean - stdDev],
    })
  );
};

const fillDescription = (d) => {
  const descriptions = [
    {
      text: 'Normal',
      show: d.value > d.minusStdDev[0] && d.value <= d.plusStdDev[1],
    },
    {
      text: 'High',
      show: d.value > d.minusStdDev[0] && d.value <= d.plusStdDev[1],
    },
    { text: 'Unusually High', show: d.value > d.twoPlusStdDev[1] },
    {
      text: 'Low',
      show: d.value > d.twoMinusStdDev[0] && d.value <= d.minusStdDev[0],
    },
    { text: 'Unusually Low', show: d.value < d.twoMinusStdDev[0] },
  ];

  const _desc = find(descriptions, { show: true });

  return {
    ...d,
    _desc: _desc ? _desc.text : '',
  };
};

const translateMeans = (means, latestWeek) => {
  if (!means || !means.length) {
    return null;
  }
  const firstHalf = means.slice(0, latestWeek);
  const secondHalf = means.slice(latestWeek);

  return secondHalf.concat(firstHalf);
};

const getYearsObj = (data, startSlice, endSlice) => {
  const grouped = groupBy(data, 'year');
  return Object.keys(grouped).map((key) => ({
    year: key,
    weeks: grouped[key].slice(
      startSlice < 0 ? grouped[key].length + startSlice : startSlice,
      endSlice < 0 ? grouped[key].length : endSlice
    ),
  }));
};

const meanData = (data) => {
  const means = [];
  data.forEach((w) => {
    w.weeks.forEach((y, i) => {
      means[i] = means[i] ? [...means[i], y.value] : [y.value];
    });
  });
  return means.map((w) => mean(w));
};

const runningMean = (data, windowSize) => {
  const smoothedMean = [];
  data.forEach((d, i) => {
    const slice = data.slice(i, i + windowSize);
    if (i < data.length - windowSize + 1) {
      smoothedMean.push(mean(slice));
    }
  });
  return smoothedMean;
};

const getDates = (data) =>
  data.map((d) => ({
    ...d,
    date: moment().year(d.year).week(d.isoweek).format('YYYY-MM-DD'),
    month: upperCase(moment().year(d.year).week(d.isoweek).format('MMM')),
  }));

export const formatYearObject = (data) => {
  const temp = [];
  forOwn(data, (value, key) => {
    return temp.push({ loss: value, year: parseInt(key, 10) });
  });
  return temp;
};
export const calculateTotal = (data): number =>
  Object.values(data).reduce((a: number, b: number) => a + b) as number;
