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

import { IPlace } from '../../../../modules/places/model';
import { IWidgetConfig } from '../../../../modules/widget/model';
import { replace } from '../../utils';
import { ProtectedAreaMetric } from './model';

interface ProtectedAreaConfig {
  metric: ProtectedAreaMetric;
}

export const CONFIG = {
  parse: ({ metric }: ProtectedAreaConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const formatValueKm2 = (value, total) => {
      let round;

      if (total >= 100000) {
        round = 100;
      } else if (total >= 10000 && total < 100000) {
        round = 10;
      } else {
        round = 1;
      }

      const t = Math.round(total * round) / round;

      return Math.round((t * Math.round(value)) / 100 / round) * round;
    };

    const {
      marine_perc,
      terrestrial_perc,
      unprotected_perc,
      terrestrial_area_km2,
      marine_area_km2,
      unprotected_area_km2,
    } = metric;

    const chartData = {
      Unprotected: Math.round(unprotected_perc),
      Protected: Math.round(marine_perc) + Math.round(terrestrial_perc),
      'Marine Protected': Math.round(marine_perc),
      'Terrestrial Protected': Math.round(terrestrial_perc),
    };

    const totalkm2 = unprotected_area_km2 + terrestrial_area_km2 + marine_area_km2;
    const unprotectedkm2 = formatValueKm2(unprotected_perc, totalkm2);
    const protectedkm2 = formatValueKm2(marine_perc + terrestrial_perc, totalkm2);

    const legend = [
      {
        label: 'Unprotected',
        value: format(',.0f')(unprotectedkm2),
        percentage: format('.0%')(unprotected_perc / 100),
        color: '#999999',
      },
      {
        label: 'Protected',
        value: format(',.0f')(protectedkm2),
        percentage: format('.0%')((marine_perc + terrestrial_perc) / 100),
        color: '#8220C3',
      },
    ];

    const { sentence, legendConfig } = widgetConfig;

    return {
      noData: !marine_perc && !terrestrial_perc && !unprotected_perc,
      chart: legendConfig.items.map((l) => {
        return {
          x: l.label,
          color: l.color,
          percentage: chartData[l.label],
          unit: '%',
          y: 100,
        };
      }),
      template: replace(
        sentence.default,
        {
          location: place.name,
          perc: format('.0%')((marine_perc + terrestrial_perc) / 100),
          wdpa_area: format(',.0f')(protectedkm2),
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
              startAngle: 180,
              endAngle: 0,
              cx: '55%',
              cy: '75%',
              dataKey: 'percentage',
              nameKey: 'x',
              innerRadius: '45%',
              outerRadius: '78%',
            },
          },
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          width: 200,
          content: (properties) => {
            return (
              <div className="widget--legend" style={{ paddingRight: 50 }}>
                <ul className="widget--legend-list">
                  {legend.map((item) => (
                    <li
                      key={`item-${item.label}`}
                      className="widget--legend-list-item --flex-column"
                    >
                      <span className="widget--legend-number">
                        {item.value}{' '}
                        <span className="unit">
                          km<sup>2</sup>
                        </span>
                      </span>
                      <div className="widget--legend-list-item-wrapper">
                        <svg height="13" width="13">
                          <rect width="13" height="13" fill={item.color} />
                        </svg>
                        <span>
                          {item.label} - {item.percentage}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        },
        // tooltip: {
        //   cursor: false,
        //   content: (
        //     <WidgetTooltip
        //       style={{
        //         color: '#FFFFFF',
        //         backgroundColor: '#383838'
        //       }}
        //       settings={[
        //         { key: "x" },
        //         { key: "percentage", format: (value) => `Percentage: ${format('.1%')(value/100)}` }
        //       ]}
        //     />
        //   )
        // }
      },
    };
  },
};

export default CONFIG;
