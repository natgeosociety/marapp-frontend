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

import { replace } from 'components/widget/utils';

const MAGNITUDE_SYMBOLS = ['t', 'kt', 'Mt', 'Gt', 'Tt'];
const MAGNITUDE_WORDS = ['', 'thousand', 'million', 'billion', 'trillion'];

function formatValue(value, decimals = 2, symbols = MAGNITUDE_SYMBOLS) {
  if (value === 0) {
    return '0';
  }

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(value) / Math.log(k));

  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + symbols[i];
}

export const CONFIG = {
  parse: ({ rows }, params, widgetConfig, place) => {
    if (!rows || !rows.length) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const data = rows[0];
    const { sentence } = widgetConfig;

    const formattedValues = {
      total: formatValue(data.sum),
    };

    return {
      noData: !data.sum,
      chart: [],
      values: formattedValues,
      template: replace(
        sentence.default,
        {
          location: place.title,
          carbon_total_t: formatValue(data.carbon_total_t, 2, MAGNITUDE_WORDS),
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {},
    };
  },
};

export default CONFIG;
