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

import findLast from 'lodash/findLast';

import { replace } from '../../utils';

const FAKE_DATA = {
  value: 16,
};

export const CONFIG = {
  parse: ({ rows }, params, widgetConfig, place) => {
    if (!rows || !rows.length) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const { sentence } = widgetConfig;

    const value = FAKE_DATA.value;
    const categories = [
      {
        label: 'very low',
        threshold: 0,
        color: '#0b4981',
      },
      {
        label: 'low',
        threshold: 5,
        color: '#2a6986',
      },
      {
        label: 'moderate',
        threshold: 10,
        color: '#398b8a',
      },
      {
        label: 'high',
        threshold: 15,
        color: '#41ae8e',
      },
      {
        label: 'very high',
        threshold: 20,
        color: '#44d290',
      },
    ];

    const category = findLast(categories, (c) => value >= c.threshold) || categories[0];

    return {
      chart: categories.map((c) => ({
        ...c,
        selected: category.threshold === c.threshold,
      })),
      template: replace(
        sentence.default,
        {
          location: place.title,
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
