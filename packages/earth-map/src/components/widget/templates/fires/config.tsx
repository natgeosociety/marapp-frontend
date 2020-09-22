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
import { formatKM2, replace } from 'components/widget/utils';
import { format } from 'd3-format';
import sumBy from 'lodash/sumBy';
import { IPlace } from 'modules/places/model';
import { IWidgetConfig } from 'modules/widget/model';
import moment from 'moment';
import React from 'react';
import { getStats } from 'utils/widget';

import { FireMetric } from './model';

// Components

// Helpers

interface FireConfig {
  metric: FireMetric;
}

export const CONFIG = {
  parse: ({ metric }: FireConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        chart: [],
        noData: true,
        template: '',
      };
    }

    const { sentence } = widgetConfig;

    const chart = getStats(metric, '2001-01-01', '2018-12-31');
    const total = sumBy(chart, 'value');
    const mean = sumBy(chart, 'mean');

    return {
      chart,
      template: replace(
        sentence,
        {
          location: place.name,
          total: `${format(formatKM2(total))(total)} km²`,
          weeks: chart.filter((d) => d.value > d.plusStdDev[1]).length,
          annualMean: `${format(formatKM2(mean))(mean)} km²`,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        patterns: {
          diagonal: {
            attributes: {
              id: 'diagonal-stripe-1',
              patternUnits: 'userSpaceOnUse',
              patternTransform: 'rotate(-45)',
              width: 6,
              height: 6,
            },
            children: {
              rect2: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 6,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#161616',
              },
              rect: {
                tag: 'rect',
                x: 0,
                y: 0,
                width: 2,
                height: 6,
                transform: 'translate(0,0)',
                fill: '#515153',
              },
            },
          },
        },
        margin: { top: 20, right: 0, left: 60, bottom: 0 },
        xKey: 'date',
        yKeys: {
          lines: {
            value: {
              stroke: '#F75353',
            },
          },
          areas: {
            plusStdDev: {
              fill: '#515153',
              stroke: '#515153',
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
            minusStdDev: {
              fill: '#515153',
              stroke: '#515153',
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
            twoPlusStdDev: {
              fill: 'url(#diagonal-stripe-1) #161616',
              stroke: '#161616',
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
            twoMinusStdDev: {
              fill: 'url(#diagonal-stripe-1) #161616',
              stroke: '#161616',
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
          },
        },

        xAxis: {
          tickCount: 12,
          interval: 4,
          tickFormatter: (t) => moment(t).format('MMM'),
        },

        yTitle: 'km²',
        yAxis: {
          domain: [0, 'auto'],
          allowDataOverflow: true,
        },

        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },

        unitFormat: (value) => `${format(formatKM2(value))(value)}`,

        tooltip: {
          cursor: {
            opacity: 0.1,
            stroke: '#F75353',
            strokeWidth: 8,
          },
          content: (
            <WidgetTooltip
              style={{
                color: '#FFF',
                backgroundColor: '#F75353',
              }}
              settings={[
                {
                  key: 'value',
                  label: 'Area:',
                  suffix: ' km² burned',
                  format: (value) => format(formatKM2(value))(value),
                },
                { key: 'date', label: 'Date:' },
              ]}
            />
          ),
        },
      },
    };
  },
};

export default CONFIG;
