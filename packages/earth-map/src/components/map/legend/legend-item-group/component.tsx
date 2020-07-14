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

import * as React from 'react';

// styles
import './styles.scss';

interface ILegendItemGroupComponent {
  activeLayer?: any;
  onChangeCurrent?: (activeLayer: any, value: any) => void;
}

class LegendItemGroupComponent extends React.PureComponent<ILegendItemGroupComponent> {
  static propTypes = {};

  static defaultProps = {
    activeLayer: {},
  };

  onChangeCurrent = e => {
    const {activeLayer, onChangeCurrent} = this.props;
    onChangeCurrent(activeLayer, e.currentTarget.value);
  };

  render() {
    const {activeLayer} = this.props;

    const {id, current, source, references} = activeLayer;
    const {type} = source;

    if (type !== 'group') {
      return null;
    }

    if (!references) {
      return null;
    }

    return (
      <div className="c-legend-item-group">
        {references.map(l => {
          const currentActive = current || references[0].id;
          const checked = currentActive === l.id;

          return (
            <div key={l.id} className="legend-item-group--radio">
              <input
                type="radio"
                name={`layer-group-${id}`}
                id={`layer-group-${l.id}`}
                value={l.id}
                checked={checked}
                onChange={this.onChangeCurrent}
              />

              <label htmlFor={`layer-group-${l.id}`}>
                <span className="legend-item-group--symbol"/>
                <span className="legend-item-group--name">{l.name}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default LegendItemGroupComponent;
