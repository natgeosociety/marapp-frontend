import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { format } from 'd3-format';
import moment from 'moment';

import './styles.scss';

class LayerPopupComponent extends PureComponent<any, any> {
  static propTypes = {
    activeInteractiveLayers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  formatValue = (config, data) => {
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

  render() {
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
