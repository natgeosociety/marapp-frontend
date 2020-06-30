import * as React from 'react';
import classnames from 'classnames';
import './styles.scss';

interface IMapControls {
  children: any;
  customClass?: string;
}

class MapControls extends React.PureComponent<IMapControls> {
  render() {
    const { customClass, children } = this.props;
    const classNames = classnames({
      'c-map-controls': true,
      [customClass]: !!customClass,
    });

    return (
      <div className={classNames}>
        <div className="map-controls--list ng-grid ng-flex-bottom">
          {React.Children.map(
            children,
            (c, i) =>
              React.isValidElement(c) && (
                <div className="map-controls--list-item" key={i}>
                  {React.cloneElement(c)}
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

export default MapControls;
