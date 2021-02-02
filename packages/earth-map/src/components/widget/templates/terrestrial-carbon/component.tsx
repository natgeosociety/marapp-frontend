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

import Collapse from '@material-ui/core/Collapse';
import React from 'react';

import { Chart } from '@marapp/earth-shared';

import WidgetNoDataComponent from '../../../../components/widget/no-data';
import WidgetTemplateText from '../../templateText';
import { IWidgetTemplate } from '../model';
import './styles.scss';

const TerrestrialCarbon = (props: IWidgetTemplate) => {
  const { chart, config, expanded, noData, template, values } = props;

  if (noData) {
    return <WidgetNoDataComponent expanded={expanded} />;
  }

  return (
    <div className="c-terrestial-carbon-widget">
      <WidgetTemplateText expanded={expanded} template={template} />

      {/* Chart */}
      {!!chart.length && (
        <Collapse in={!!expanded}>
          <div className="tcw--content">
            <div className="tcw--number -center">
              {values.total}
              <div className="tcw--subtitle">Terrestrial Carbon</div>
            </div>

            <Chart data={chart} config={config} />

            <div className="tcw--sum">
              <div className="tcw--number -left">
                {values.biomass}
                <div className="tcw--subtitle">Biomass Carbon</div>
              </div>

              <div className="tcw--number -right">
                {values.soil}
                <div className="tcw--subtitle">Soil Carbon</div>
              </div>
            </div>
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default TerrestrialCarbon;
