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
import React from 'react';

import WidgetTooltip from '../../../../components/widget/tooltip';
import { formatKM2, formatPercentage, replace } from '../../utils';

const COLORS = {
  10: '#030676',
  20: '#012684',
  30: '#0A5692',
  40: '#207389',
  50: '#338B89',
  60: '#41A084',
  70: '#55B87A',
  80: '#77CA66',
  90: '#B8DB5F',
  100: '#FCE726',
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

    const data = rows[0];
    const { sentence } = widgetConfig;

    const chart = Object.keys(data)
      .filter((k) => k.includes('_percentile'))
      .map((k) => {
        const percentile = k.split('_')[1];
        return {
          percentile: parseInt(percentile, 10),
          km2: parseInt(data[k], 10),
          color: COLORS[percentile],
        };
      })
      .sort((a, b) => a.percentile - b.percentile);

    return {
      chart,
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
      config: {
        xKey: 'percentile',
        margin: { top: 20, right: 0, left: 40, bottom: 0 },
        yKeys: {
          bars: {
            km2: {
              itemColor: true,
              maxBarSize: 20,
            },
          },
        },
        xAxis: {
          axisLine: {
            stroke: '#CCC',
            strokeWidth: 1,
          },
          tick: { fontSize: 11, fill: '#FFF', fontWeight: 500 },
          tickFormatter: (value) => `${format(formatPercentage(value / 100))(value / 100)}`,
          interval: 0,
        },
        yTitle: 'km²',
        yAxis: {},
        unitFormat: (v) => {
          return `${format(formatKM2(v))(v)}`;
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              settings={[
                {
                  label: 'Percentile:',
                  key: 'percentile',
                  format: (value) => `${format(formatPercentage(value / 100))(value / 100)}`,
                },
                {
                  label: 'Value:',
                  key: 'km2',
                  format: (value) => `${format(formatKM2(value))(value)} km²`,
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
