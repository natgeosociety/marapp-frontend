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
    const { activeLayer, onChangeCurrent } = this.props;
    onChangeCurrent(activeLayer, e.currentTarget.value);
  };

  render() {
    const { activeLayer } = this.props;

    const { id, current, source } = activeLayer;
    const { type, layers } = source;

    if (type !== 'group') {
      return null;
    }

    if (!layers) {
      return null;
    }

    return (
      <div className="c-legend-item-group">
        {layers.map(l => {
          const currentActive = current || layers[0].id;
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
                <span className="legend-item-group--symbol" />
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
