import * as React from 'react';
import classnames from 'classnames';

import './styles.scss';

export interface IRecenter {
  className?: string;
  onClick: () => void;
}

class RecenterControl extends React.PureComponent<IRecenter> {
  static defaultProps = {
    className: null,
  };

  render() {
    const { className, onClick } = this.props;

    const classNames = classnames({
      'c-recenter-control': true,
      [className]: !!className,
    });

    return (
      <div className={classNames}>
        <button type="button" className="recenter-control--btn" onClick={onClick}>
          <i className="ng-body-color ng-icon-geolocate"></i>
        </button>
      </div>
    );
  }
}

export default RecenterControl;
