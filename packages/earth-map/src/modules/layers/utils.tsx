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

import moment from 'moment';

export const getParams = (config = [], params = {}) => {
  const defaultParams = config.reduce((acc, v) => {
    let value;

    const key = v.key;
    value = key.includes('REACT_APP') ? process.env[key] : v.default;

    if (v.key_params) {
      value = v.key_params.reduce((acc_2, v_2) => {
        const key2 = v_2.key;
        const value2 = key2.includes('REACT_APP') ? process.env[key] : v_2.default;

        return {
          [key2]: value2,
        };
      }, {});
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  const newParams = {
    ...defaultParams,
    ...params,
  };

  const { startDate: start, endDate, trimEndDate, maxAbsoluteDate } = newParams;

  const end = endDate > maxAbsoluteDate ? maxAbsoluteDate : endDate;
  const trim = trimEndDate > maxAbsoluteDate ? maxAbsoluteDate : trimEndDate;

  return {
    ...newParams,
    ...(!!start && {
      startYear: moment(start).year(),
      startMonth: moment(start).month(),
      startDay: moment(start).dayOfYear(),
    }),
    ...(!!endDate && {
      endYear: moment(end).year(),
      endMonth: moment(end).month(),
      endDay: moment(end).dayOfYear(),
    }),
    ...(!!trimEndDate && {
      trimEndYear: moment(trim).year(),
      trimEndMonth: moment(trim).month(),
      trimEndDay: moment(trim).dayOfYear(),
    }),
  };
};
