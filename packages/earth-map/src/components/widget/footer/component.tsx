import React from 'react';
import classnames from 'classnames';

interface IWidgetFooter {
  active: boolean;
  collapsed?: any;
  color?: any;
  onToggleLayer: (active: boolean) => {};
  onCollapse: (active: boolean) => {};
}

class WidgetFooterComponent extends React.PureComponent<IWidgetFooter> {
  onToggleLayer = () => {
    const { active, onToggleLayer } = this.props;
    onToggleLayer(active);
  };

  render() {
    const { active } = this.props;

    return (
      <footer className="widget--footer">
        <button
          className={classnames({
            'ng-button ng-button-secondary': true,
            active: active,
          })}
          onClick={this.onToggleLayer}
        >
          {active ? 'Remove from map' : 'Show on map'}
        </button>
      </footer>
    );
  }
}

export default WidgetFooterComponent;
