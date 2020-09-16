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

import { replace } from 'components/widget/utils';
import { format } from 'd3-format';
import { IPlace } from 'modules/places/model';
import { IWidgetConfig } from 'modules/widget/model';
import React from 'react';

import { TerrestrialCarbonMetric } from './model';
import Tick from './tick';

// Utils
interface TerrestrialCarbonConfig {
  metric: TerrestrialCarbonMetric;
}

const MAGNITUDE_SYMBOLS = ['t', 'kt', 'Mt', 'Gt', 'Tt'];
const MAGNITUDE_WORDS = ['', 'thousand', 'million', 'billion', 'trillion'];

function formatValue(value, decimals = 2, symbols = MAGNITUDE_SYMBOLS) {
  if (value === 0) {
    return '0';
  }

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(value) / Math.log(k));

  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + symbols[i];
}

export const CONFIG = {
  parse: (
    { metric }: TerrestrialCarbonConfig,
    params,
    widgetConfig: IWidgetConfig,
    place: IPlace
  ) => {
    if (!metric) {
      return {
        noData: true,
        chart: [],
        template: '',
      };
    }

    const { sentence } = widgetConfig;

    const percValues = {
      biomass: metric.carbon_total_t / metric.carbon_soil_total_t,
      soil: metric.soil_total_t / metric.carbon_soil_total_t,
      total: metric.carbon_soil_total_t / metric.carbon_soil_total_t,
    };

    const formattedValues = {
      biomass: formatValue(metric.carbon_total_t),
      soil: formatValue(metric.soil_total_t),
      total: formatValue(metric.carbon_soil_total_t),
    };

    return {
      noData: !metric.carbon_total_t && !metric.soil_total_t && !metric.carbon_soil_total_t,
      chart: [
        {
          x: 'Biomass carbon',
          x2: 'Soil carbon',
          unit: '%',
          y: percValues.biomass * 100,
          y2: percValues.soil * 100,
        },
      ],
      values: formattedValues,
      template: replace(
        sentence.default,
        {
          location: place.name,
          soil_perc: format('.0%')(percValues.soil),
          biomass_perc: format('.0%')(percValues.biomass),
          carbon_soil_total_t: formatValue(metric.carbon_soil_total_t, 2, MAGNITUDE_WORDS),
          total_density: formatValue(metric.total_density, 2, MAGNITUDE_WORDS),
        },
        {},
        {
          className: 'ng-text-weight-bold',
        }
      ),
      config: {
        layout: 'vertical',
        margin: { top: 0, right: 0, left: 0, bottom: 0 },
        height: 60,
        xKeys: {
          x: 'Biomass carbon',
          x2: 'Soil carbon',
        },
        yKeys: {
          bars: {
            y: {
              fill: '#FD9E59',
              stackId: 'A',
              animationDuration: percValues.biomass * 1000,
            },
            y2: {
              fill: '#8C510A',
              stackId: 'A',
              animationBegin: percValues.biomass * 1000,
              animationDuration: percValues.soil * 1000,
            },
          },
        },
        xAxis: {
          type: 'number',
          domain: [0, 100],
          tick: <Tick />,
          ticks: [50],
        },
        yAxis: {
          type: 'category',
        },
      },
    };
  },
};

export default CONFIG;
