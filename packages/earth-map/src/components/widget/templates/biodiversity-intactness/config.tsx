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
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import React from 'react';

import WidgetTooltip from '../../../../components/widget/tooltip';
import { replace } from '../../../../components/widget/utils';
import { IPlace } from '../../../../modules/places/model';
import { IWidgetConfig } from '../../../../modules/widget/model';
import { BiodiversityIntactnessMetric } from './model';

interface BioConfig {
  metric: BiodiversityIntactnessMetric;
}

export const CONFIG = {
  parse: ({ metric }: BioConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const { int_perc } = metric;

    const { legendConfig, sentence } = widgetConfig;

    // Get values
    const values = [];
    const percentileScale = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    percentileScale.forEach((sc) => {
      return values.push({
        key: `percentile_${sc}`,
        value: metric[`percentile_${sc}`],
        y: sc,
      });
    });

    const sum = sumBy(values, 'value');

    const mode_ints = [
      { text: 'very low', show: int_perc <= 20, value: int_perc },
      { text: 'low', show: int_perc > 20 && int_perc <= 40, value: int_perc },
      {
        text: 'medium',
        show: int_perc > 40 && int_perc <= 60,
        value: int_perc,
      },
      { text: 'high', show: int_perc > 60 && int_perc <= 80, value: int_perc },
      { text: 'very high', show: int_perc > 80, value: int_perc },
    ];

    function getValues(arr) {
      return arr.reduce((acc, v) => {
        return acc + values.find((v2) => v2.key === v).value;
      }, 0);
    }

    function getPercValues(arr) {
      const value = arr.reduce((acc, v) => {
        return acc + values.find((v2) => v2.key === v).value;
      }, 0);

      return value / sum;
    }
    return {
      noData: values.every((v) => !v.value),
      chart: legendConfig.items
        .map((l) => {
          return {
            x: l.label,
            area: getValues(l.keys),
            percentage: getPercValues(l.keys),
            y: 100,
            color: l.color,
            name: l.label,
          };
        })
        .reverse(),
      template: replace(
        sentence.default,
        {
          location: place.name,
          year: 2015,
          int_perc: `${format('.2r')(int_perc)}%`,
          change_category: mode_ints.find((mi) => mi.show).text,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        type: 'pie',
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'percentage',
        yKeys: {
          pies: {
            y: {
              cx: '60%',
              cy: '45%',
              dataKey: 'percentage',
              nameKey: 'x',
              innerRadius: '60%',
              outerRadius: '80%',
            },
          },
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          content: (properties) => {
            const { payload } = properties;
            const groups = groupBy(payload, (p) => p.payload.category);

            return (
              <div className="widget--legend">
                {Object.keys(groups).map((g) => (
                  <div key={g} className="widget--legend-group">
                    <ul className="widget--legend-list">
                      {groups[g].map((item) => (
                        <li key={`item-${item.color}`} className="widget--legend-list-item">
                          <span
                            className="widget--legend-list-item-square"
                            style={{ background: item.color }}
                          />

                          <span>
                            {item.value}{' '}
                            <span className="widget--legend-list-item-value">
                              {' '}
                              - {format('.2%')(item.payload.percent)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          },
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
                {
                  label: 'Category:',
                  key: 'x',
                },
                {
                  label: 'Area:',
                  key: 'area',
                  format: (value) => `${format(',.0f')(value)}km²`,
                },
                {
                  label: 'Percentage:',
                  key: 'percentage',
                  format: (value) => `${format('.2%')(value)}`,
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
