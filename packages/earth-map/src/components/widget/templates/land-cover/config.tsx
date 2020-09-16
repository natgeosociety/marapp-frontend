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
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import { IPlace } from 'modules/places/model';
import { IWidgetConfig } from 'modules/widget/model';
import React from 'react';

import { LandCoverMetric } from './model';

// Utils

// Components
interface LandCoverConfig {
  metric: LandCoverMetric;
}

export const CONFIG = {
  parse: ({ metric }: LandCoverConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const data = metric;
    const { sentence, legendConfig } = widgetConfig;

    const parsedYears = {
      2015: data.data_2015,
    };

    const data2015 = parsedYears['2015'];

    const px_2015 = sum(
      Object.values(data2015).map((value) => {
        return value;
      })
    );

    let data2015Perc = {};
    Object.keys(data2015).forEach((key) => {
      data2015Perc = {
        ...data2015Perc,
        [key]: (100 * data2015[key]) / px_2015,
      };
    });

    const graphValues = Object.keys(data2015Perc).reduce((acc, value) => {
      return {
        ...acc,
        [value.toLowerCase()]: data2015Perc[value],
      };
    }, {});

    return {
      chart: sortBy(
        legendConfig.items
          .filter((l) => graphValues[l.label.toLowerCase()])
          .map((l) => {
            const percentage = graphValues[l.label.toLowerCase()];
            const area = data2015[l.label.toLowerCase()];

            return {
              x: l.label,
              color: l.color,
              percentage,
              area,
              y: 100,
            };
          }),
        'percentage'
      ).reverse(),
      template: replace(
        sentence.default,
        {
          location: place.name,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        type: 'pie',
        margin: { top: 0, right: 0, left: 0, bottom: 0 },
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
                      {sortBy(groups[g], 'payload.percent')
                        .reverse()
                        .map((item) => (
                          <li key={`item-${item.color}`} className="widget--legend-list-item">
                            <span
                              className="widget--legend-list-item-square"
                              style={{ background: item.color }}
                            />

                            <span>
                              {item.value}{' '}
                              <span className="widget--legend-list-item-value">
                                {' '}
                                - {format('.2%')(item.payload.percentage / 100)}
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
                  format: (value) => `${format('.2%')(value / 100)}`,
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
