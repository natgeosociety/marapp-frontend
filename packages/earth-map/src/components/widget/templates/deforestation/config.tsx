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
import { calculateTotal, formatYearObject } from 'utils/widget';
import { replace, formatKM2, formatPercentage } from 'components/widget/utils';

// Components
import WidgetTooltip from 'components/widget/tooltip';

import { IWidgetConfig } from 'modules/widget/model';
import { IPlace } from 'modules/places/model';

import { DeforestationMetric } from './model';

interface DeforestationConfig {
  metric: DeforestationMetric;
}

export const CONFIG = {
  parse: ({ metric }: DeforestationConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const { year_data, area_km2 } = metric;

    const total: number = calculateTotal(year_data);

    const years = formatYearObject(year_data);

    const { sentence } = widgetConfig;

    const loss_total = total;
    const loss_total_format = formatKM2(loss_total);

    const loss_total_perc = total / area_km2;
    const loss_total_perc_format = formatPercentage(loss_total_perc);

    return {
      chart: years,
      template: replace(
        sentence.default,
        {
          location: place.name,
          start_year: 2001,
          end_year: 2018,
          first_year: 2000,
          loss_total_area: `${format(loss_total_format)(loss_total)} km²`,
          loss_total_perc: `${format(loss_total_perc_format)(loss_total_perc)}`,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        xKey: 'year',
        margin: { top: 20, right: 0, left: 60, bottom: 5 },
        yKeys: {
          bars: {
            loss: {
              maxBarSize: 100,
              fill: '#FD6B85',
            },
          },
        },
        // xTitle: 'years',
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
        yTitle: 'km²',
        yAxis: {},
        unitFormat: v => {
          return `${format(loss_total_format)(v)}`;
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
                  label: 'Loss:',
                  key: 'loss',
                  format: value => {
                    const f = formatKM2(value);
                    return `${format(f)(value)} km²`;
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
