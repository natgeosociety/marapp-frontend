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

import { Html } from '@marapp/earth-shared';
import classnames from 'classnames';
import WidgetNoDataComponent from 'components/widget/no-data';
import React from 'react';

import { IWidgetTemplate } from '../model';

import './styles.scss';

class OceanCarbonPriorities extends React.PureComponent<IWidgetTemplate, any> {
  public static defaultProps = {
    collapsed: false,
  };

  public collapsed() {
    const { template } = this.props;

    return (
      <div className="widget--template">
        <Html html={template} />
      </div>
    );
  }

  public expanded() {
    const { chart, template } = this.props;

    return (
      <div className="c-chart-ocean-carbon-priorities">
        <div className="widget--template">
          <Html html={template} />
        </div>

        {/* Chart */}
        {!!chart.length && (
          <div className="ocp--chart">
            <ul className="ocp--chart-list">
              {chart.map((c: any) => (
                <li
                  className={classnames({
                    'ocp--chart-list-item': true,
                    '-selected': c.selected,
                  })}
                  key={c.label}
                  style={{
                    width: `calc(${100 / chart.length}% - 4px)`,
                    backgroundColor: c.color,
                  }}
                >
                  <div className="ocp--chart-list-item-label">{c.label}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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

export default OceanCarbonPriorities;
