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

import React from 'react';

// Utils
import { format } from 'd3-format';
import { parseObject } from 'utils/widget';
import { replace } from 'components/widget/utils';
import findLast from 'lodash/findLast';

// Components
import WidgetTooltip from 'components/widget/tooltip';

export const CONFIG = {
  parse: ({ rows }, params, widgetConfig, place) => {
    if (!rows || !rows.length) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const categories = {
      0: 'low',
      0.55: 'medium',
      0.7: 'high',
      0.8: 'very high',
    };

    const rounded = value => {
      return Math.round(value * 100) / 100;
    };

    const data = rows[0];
    const yearData = parseObject(data.year_data);

    const chart = Object.keys(yearData).map(k => {
      return {
        year: k,
        unit: '%',
        percentage: rounded(yearData[k]),
      };
    });

    const mean_1990 = rounded(yearData['1990']);
    const mean_2015 = rounded(yearData['2015']);

    const sentenceType = mean_1990 !== mean_2015 ? 'default' : 'noChange';

    const change_type = mean_1990 > mean_2015 ? 'a decrease' : 'an increase';

    const change_category_key = findLast(Object.keys(categories), k => {
      // @ts-ignore
      return mean_2015 >= k;
    });
    const change_category = categories[change_category_key];

    const { sentence } = widgetConfig;

    return {
      noData: chart.every(c => !c.percentage),
      chart,
      template: replace(
        sentence[sentenceType],
        {
          location: place.title,
          start_year: 1990,
          end_year: 2015,
          start_mean: `${mean_1990}`,
          end_mean: `${mean_2015}`,
          change_perc: `${rounded(Math.abs(mean_2015 - mean_1990))}`,
          change_type,
          change_category,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        gradients: {
          default: {
            attributes: {
              id: 'lg_default',
              x1: '0%',
              y1: '0%',
              x2: '0%',
              y2: '100%',
              gradientUnits: 'userSpaceOnUse',
            },
            stops: [
              { offset: '0%', stopColor: '#780126' },
              { offset: '20%', stopColor: '#BF0650' },
              { offset: '40%', stopColor: '#E62C90' },
              { offset: '60%', stopColor: '#D47DBC' },
              { offset: '80%', stopColor: '#D5BBDB' },
              { offset: '100%', stopColor: '#ECE5F4' },
            ],
          },
        },
        margin: { top: 20, right: 0, left: 40, bottom: 0 },
        xKey: 'year',
        yKeys: {
          lines: {
            percentage: {
              type: 'linear',
              stroke: 'url(#lg_default)',
              isAnimationActive: false,
            },
          },
        },
        xAxis: {
          axisLine: true,
        },
        yTitle: 'From Low to High',
        yAxis: {
          domain: [0, 1],
          // Format ticks
        },
        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },

        unitFormat: value => {
          return format('.2f')(value);
        },

        tooltip: {
          cursor: {
            opacity: 0.1,
            stroke: '#CCCCCC',
            strokeWidth: 8,
          },
          content: (
            <WidgetTooltip
              style={{
                color: '#FFFFFF',
                backgroundColor: '#383838',
              }}
              settings={[
                { label: 'Year:', key: 'year' },
                {
                  label: 'HDI:',
                  key: 'percentage',
                  format: value => `${format('.2r')(value)}`,
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
