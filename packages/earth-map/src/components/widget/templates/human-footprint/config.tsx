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

import WidgetTooltip from 'components/widget/tooltip';
import { replace } from 'components/widget/utils';
import { format } from 'd3-format';
import findLast from 'lodash/findLast';
import { IPlace } from 'modules/places/model';
import { IWidgetConfig } from 'modules/widget/model';
import React from 'react';

import { HumanFootprintMetric } from './model';

// Utils

// Components

interface HumanFootprintConfig {
  metric: HumanFootprintMetric;
}

export const CONFIG = {
  parse: ({ metric }: HumanFootprintConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const CATEGORIES = {
      no: 'no degradation (Wild)',
      0: 'low degradation',
      4: 'moderate degradation',
      8: 'high degradation',
    };

    const data = metric;
    const { sentence, legendConfig } = widgetConfig;
    const mean_93 = Math.round(data.mean_93);
    const mean_09 = Math.round(data.mean_09);

    const sentenceType = mean_93 !== mean_09 ? 'default' : 'noChange';

    const change_type = mean_93 > mean_09 ? 'a decrease' : 'an increase';

    const change_category_key = findLast(Object.keys(CATEGORIES), (k) => {
      if (mean_09 === 0) {
        return 'no';
      }
      // @ts-ignore
      return mean_09 >= k;
    });
    // @ts-ignore
    const change_category = CATEGORIES[change_category_key];

    return {
      chart: legendConfig.items.map((l) => {
        return {
          x: l.label,
          color: '#E62C90',
          unit: '%',
          y: Math.round(data[`mean_${l.label.substring(2)}`]),
        };
      }),
      template: replace(
        sentence[sentenceType],
        {
          location: place.name,
          mean_93: format('.0f')(mean_93),
          mean_09: format('.0f')(mean_09),
          change_type,
          change_category,
          change_perc: format('.0f')(Math.abs(mean_09 - mean_93)),
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        margin: { top: 20, right: 0, left: 30, bottom: 0 },
        xKey: 'x',
        yKeys: {
          bars: {
            y: {
              maxBarSize: 100,
              itemColor: true,
            },
          },
        },
        xAxis: {
          axisLine: {
            stroke: '#CCC',
            strokeWidth: 1,
          },
        },
        yTitle: 'From Low to High',
        yAxis: {
          domain: [0, 50],
          ticks: [0, 12.5, 25, 37.5, 50],
        },
        unitFormat: (value) => {
          if (value % 1 !== 0) {
            return null;
          }
          return value;
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
                { label: 'Year:', key: 'x' },
                {
                  label: 'Score:',
                  key: 'y',
                  format: (value) => `${format('.0f')(value)}`,
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
