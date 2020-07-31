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

import { format } from 'd3-format';
import { replace } from 'components/widget/utils';

import { IWidgetConfig } from 'modules/widget/model';
import { IPlace } from 'modules/places/model';
import { HumanImpactMetric } from './model';
interface HumanImpactConfig {
  metric: HumanImpactMetric;
}

export const CONFIG = {
  parse: ({ metric }: HumanImpactConfig, params, widgetConfig: IWidgetConfig, place: IPlace) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: {},
      };
    }

    const { sentence, legendConfig } = widgetConfig;

    const lowImpactedArea = metric.area_0 + metric.area_1 + metric.area_2;
    const totalArea =
      metric.area_0 +
      metric.area_1 +
      metric.area_2 +
      metric.area_3 +
      metric.area_4 +
      metric.area_no_data;

    const lowImpactedLength = Math.sqrt(lowImpactedArea);
    const totalLength = Math.sqrt(totalArea);
    const totalLengthDomain = totalLength + totalLength * 0.25;

    const legend = legendConfig.items.map((l, i) => ({
      ...l,
      ...(i === 0 && { value: totalArea }),
      ...(i === 1 && { value: lowImpactedArea }),
    }));

    const formatStr = totalArea > 9999 ? ',.3r' : ',.0f';

    const chart = [
      {
        totalLength,
        lowImpactedLength,
        value: 0,
      },
      {
        totalLength,
        lowImpactedLength,
        value: lowImpactedLength,
      },
      {
        totalLength,
        lowImpactedLength: 0,
        value: lowImpactedLength,
      },
      {
        totalLength,
        lowImpactedLength: 0,
        value: totalLength,
      },
    ];

    return {
      chart,
      template: replace(
        sentence.default,
        {
          location: place.name,
          low_impact_perc: format('.0%')(lowImpactedArea / totalArea),
          low_impact_area: `${format(formatStr)(lowImpactedArea)} km²`,
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        // todo is this needed?
        // tableName: 'burn_area_parsed',
        // url:
        //   'https://simbiotica.carto.com/api/v2/sql?q=SELECT * FROM {tableName} WHERE id = {id}',
        xKey: 'value',
        yKeys: {
          areas: {
            totalLength: {
              type: 'stepAfter',
              fill: '#ffffcc',
              fillOpacity: 1,
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
            lowImpactedLength: {
              type: 'stepAfter',
              fill: '#31a354',
              fillOpacity: 1,
              strokeWidth: 0,
              background: false,
              activeDot: false,
            },
          },
        },

        xAxis: {
          reversed: true,
          type: 'number',
          domain: [0, totalLengthDomain],
          ticks: [0, totalLengthDomain / 2, totalLengthDomain],
          interval: 0,
          allowDataOverflow: true,
          tickFormatter: t => `${format(',.0r')(t)}km`,
        },

        yAxis: {
          orientation: 'right',
          domain: [0, totalLengthDomain],
          ticks: [0, totalLengthDomain / 2, totalLengthDomain],
          tickSize: -10,
          allowDataOverflow: true,
        },

        cartesianGrid: {
          vertical: false,
          strokeDasharray: '6 6',
        },

        margin: { left: 0, right: 65, top: 20, bottom: 0 },
        height: 200,
        width: 150,
        unitFormat: t => `${format(',.0r')(t)}km`,

        legend: {
          align: 'left',
          verticalAlign: 'middle',
          layout: 'vertical',
          width: 225,
          content: properties => {
            return (
              <div className="widget--legend" style={{ paddingRight: 50 }}>
                <ul className="widget--legend-list">
                  {legend.map(item => (
                    <li
                      key={`item-${item.label}`}
                      className="widget--legend-list-item --flex-column"
                    >
                      <span className="widget--legend-number">
                        {format(formatStr)(item.value)}{' '}
                        <span className="unit">
                          km<sup>2</sup>
                        </span>
                      </span>
                      <div className="widget--legend-list-item-wrapper">
                        <svg height="13" width="13">
                          <rect width="13" height="13" fill={item.color} />
                        </svg>
                        <span>{item.label}s</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        },
      },
    };
  },
};

export default CONFIG;
