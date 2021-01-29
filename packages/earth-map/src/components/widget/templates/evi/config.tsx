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

import { format } from 'd3-format';
import ceil from 'lodash/ceil';
import React from 'react';

import WidgetTooltip from '../../../../components/widget/tooltip';
import { IPlace } from '../../../../modules/places/model';
import { IWidgetConfig } from '../../../../modules/widget/model';
import { getColorFromPallete, replace } from '../../utils';
import { EviMetric } from './model';

interface EviConfig {
  metric: EviMetric;
}

const EVI_PALLETE = [
  { color: '#8c510a', quantity: 0 },
  { color: '#d8b365', quantity: 2 },
  { color: '#e6f598', quantity: 4 },
  { color: '#91cf60', quantity: 6 },
  { color: '#31a354', quantity: 12 },
  { color: '#006837', quantity: 15 },
];

export const CONFIG = {
  parse: ({ metric }: EviConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const eviFormat = ',.2f';
    const {
      rg_start,
      rg_end,
      std_m1,
      std_m2,
      std_p1,
      std_p2,
      rg_slope,
      year_data,
      mean_norm,
    } = metric;
    const { sentence } = widgetConfig;
    const eviLast = year_data[year_data.length - 1];

    const condition = evi_condition(rg_start, rg_end, std_m1, std_m2, std_p1, std_p2, rg_slope);
    const evi_val = evi_value(eviLast, mean_norm, std_m2, std_p2);

    const maxYAxis = Math.max.apply(
      Math,
      year_data.map(function (year) {
        return year.norm;
      })
    );

    const roundedMaxYAxis = ceil(maxYAxis, 1);

    const ticks = generateTicks(0, roundedMaxYAxis);

    return {
      chart: year_data.map((y) => {
        return {
          year: y.year,
          value: `${format(eviFormat)(y.norm)}`,
          mean: mean_norm,
          fill: getColorFromPallete(EVI_PALLETE, y.norm),
          radius: [5, 5, 0, 0],
        };
      }),
      template: replace(
        sentence.default,
        {
          location: place.name,
          most_recent_year: eviLast.year,
          condition,
          evi_val,
          N: year_data.length,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        xKey: 'year',
        margin: { top: 20, right: 0, left: 40, bottom: 5 },
        yKeys: {
          lines: {
            mean: {
              stroke: '#FF0000',
              strokeDasharray: '6 3',
            },
          },
          bars: {
            value: {},
          },
        },
        xAxis: {
          axisLine: {
            stroke: '#CCC',
            strokeWidth: 1,
          },
          angle: -45,
          dx: -10,
          dy: 10,
          tick: { fontSize: 11, fill: '#FFF', fontWeight: 500 },
          interval: 0,
        },
        yAxis: {
          ticks,
          domain: [0, roundedMaxYAxis],
          interval: 0,
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              style={{
                color: '#FFFFFF',
                backgroundColor: '#383838',
              }}
              settings={[
                { label: 'Year:', key: 'year' },
                {
                  label: 'Value:',
                  key: 'value',
                  format: (value) => {
                    return `${format(eviFormat)(value)}`;
                  },
                },
                {
                  label: 'Mean:',
                  key: 'mean',
                  format: (value) => {
                    return `${format(eviFormat)(value)}`;
                  },
                },
              ]}
            />
          ),
        },
      },
    };
  },
};

export default CONFIG;

const evi_condition = (rg_start, rg_end, std_m1, std_m2, std_p1, std_p2, rg_slope) => {
  if (rg_start >= std_m1 && rg_start < std_p1 && rg_end >= std_m1 && rg_end < std_p1) {
    return 'been stable';
  } else {
    if (rg_slope < 0 && rg_start > std_p2 && rg_end < std_m2) {
      return 'significantly decreased';
    } else if (rg_slope < 0) {
      return 'decreased';
    } else if (rg_slope > 0 && rg_start < std_m2 && rg_end > std_p2) {
      return 'significantly increased';
    } else if (rg_slope > 0) {
      return 'increased';
    }
  }
};

const evi_value = (year_data, norm_mean, std_m2, std_p2) => {
  if (year_data.norm < norm_mean && year_data.norm >= std_m2) {
    return 'lower';
  } else if (year_data.norm > norm_mean && year_data.norm <= std_p2) {
    return 'higher';
  } else if (year_data.norm < norm_mean && year_data.norm < std_m2) {
    return 'significantly lower';
  } else if (year_data.norm > norm_mean && year_data.norm > std_p2) {
    return 'significantly higher';
  } else {
    return 'equal';
  }
};

const generateTicks = (start, end) => {
  const middle = Math.round(end) / 2;
  const firstStop = middle / 2;
  const lastStop = middle + firstStop;
  return [start, firstStop, middle, lastStop, end];
};
