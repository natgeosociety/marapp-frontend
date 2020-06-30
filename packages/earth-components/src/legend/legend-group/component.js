import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// styles
import './styles.scss';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class LegendGroup extends PureComponent {
  static propTypes = {
    layerConfig: PropTypes.shape({}).isRequired,
    onChangeLayer: PropTypes.func.isRequired
  }

  onChange = (e) => {
    const { slug, onChangeLayer } = this.props;
    const { value } = e.currentTarget;


    onChangeLayer({
      slug,
      active: value
    });
  }

  setCurrentMonth = () => {
    const { layerConfig } = this.props;
    const { active, layers } = layerConfig;

    const current = layers.find(l => l.id === active);
    const { layerConfig: currentLayerConfig } = current;
    const { month } = currentLayerConfig;

    return month;
  }

  render() {
    const { layerConfig } = this.props;
    const { layers, active } = layerConfig;
    const currenMonth = this.setCurrentMonth();

    return (
      <div className="c-legend-group">
        <span>Displaying </span>

        <div className="legend-group--select">
          <span className="legend-group--select-value">{MONTHS[currenMonth]}</span>
          <select
            className="legend-group--select-element"
            onChange={this.onChange}
          >
            {layers.map(l => {
              const { layerConfig } = l;
              const { month } = layerConfig;

              return (
                <option
                  {...active === l.id && { selected: true }}
                  value={l.id}
                >
                  {MONTHS[month]}</option>
              )
            })}
          </select>
        </div>
      </div>
    )

  }
}

export default LegendGroup;
