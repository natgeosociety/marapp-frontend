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
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import './styles.scss';

class LayerPopupComponent extends PureComponent<any, any> {
  public static propTypes = {
    activeInteractiveLayers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  public formatValue = (config, data) => {
    const { column, format: format_str, prefix, suffix, type } = config;
    let value = data[column];

    switch (type) {
      case 'date': {
        if (value && format_str) {
          value = moment(value).format(format_str);
        }

        break;
      }

      case 'number': {
        if (value && format_str) {
          value = format(format_str)(value);
        }

        break;
      }

      default: {
        value = data[column];
      }
    }

    return `${prefix} ${value} ${suffix}`;
  };

  public render() {
    const { activeInteractiveLayer, activeInteractiveLayers } = this.props;
    const { name, data } = activeInteractiveLayer;
    const { interactionConfig } = activeInteractiveLayer.config || activeInteractiveLayer;
    const { output } = interactionConfig;

    return (
      <div className="c-layer-popup">
        <h4 className="layer-popup--title">
          {name}

          <select className="layer-popup--select">
            {activeInteractiveLayers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </h4>

        <table className="layer-popup--table">
          <tbody>
            {output
              .filter((o) => !o.hidden)
              .map((o) => {
                return (
                  <tr key={o.column} className="layer-popup--table-item">
                    <td className="layer-popup--list-dt">{o.property}:</td>
                    <td className="layer-popup--list-dd">{this.formatValue(o, data.data)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default LayerPopupComponent;
