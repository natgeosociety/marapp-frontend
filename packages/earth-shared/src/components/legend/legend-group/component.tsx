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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class LegendGroup extends PureComponent {
  static propTypes = {
    layerConfig: PropTypes.shape({}).isRequired,
    onChangeLayer: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    const { slug, onChangeLayer } = this.props;
    const { value } = e.currentTarget;

    onChangeLayer({
      slug,
      active: value,
    });
  };

  setCurrentMonth = () => {
    const { layerConfig } = this.props;
    const { active, layers } = layerConfig;

    const current = layers.find((l) => l.id === active);
    const { layerConfig: currentLayerConfig } = current;
    const { month } = currentLayerConfig;

    return month;
  };

  render() {
    const { layerConfig } = this.props;
    const { layers, active } = layerConfig;
    const currenMonth = this.setCurrentMonth();

    return (
      <div className="c-legend-group">
        <span>Displaying </span>

        <div className="legend-group--select">
          <span className="legend-group--select-value">{MONTHS[currenMonth]}</span>
          <select className="legend-group--select-element" onChange={this.onChange}>
            {layers.map((l) => {
              const { layerConfig } = l;
              const { month } = layerConfig;

              return (
                <option {...(active === l.id && { selected: true })} value={l.id}>
                  {MONTHS[month]}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}

export default LegendGroup;
