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

import { Chart, Html } from '@marapp/earth-shared';
import WidgetNoDataComponent from 'components/widget/no-data';
import React from 'react';

import { IWidgetTemplate } from '../model';

class BiodiversityIntactness extends React.PureComponent<IWidgetTemplate> {
  public static defaultProps = {
    collapsed: false,
  };

  public collapsed() {
    const { template } = this.props;

    return <div className="widget--template">{template}</div>;
  }

  public expanded() {
    const { chart, template, config } = this.props;

    return (
      <React.Fragment>
        <div className="widget--template ng-margin-large-bottom">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!chart.length && <Chart data={chart} config={config} />}
      </React.Fragment>
    );
  }

  public render() {
    const { collapsed, noData } = this.props;

    if (noData) {
      return <WidgetNoDataComponent />;
    }

    const content = collapsed ? this.collapsed() : this.expanded();

    return content;
  }
}

export default BiodiversityIntactness;
