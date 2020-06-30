import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import { Tooltip } from 'vizzuality-components';
import WidgetDownload from '../download';

// Styles
import './styles.scss';


class WidgetToolbarComponent extends PureComponent<any, any> {
  static propTypes = {
    className: PropTypes.string,
    activeInfo: PropTypes.bool.isRequired,
    activeShare: PropTypes.bool.isRequired,
    activeDownload: PropTypes.bool.isRequired,
    onDownload: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, activeInfo, onInfo, data } = this.props;

    const classNames = classnames({
      [className]: !!className,
    });

    return (
      <div className={`c-widget-toolbar ng-flex ng-margin-horizontal ${classNames}`}>
        <div className="ng-margin-right">
          <Tooltip
            placement="top"
            overlay={<span>Info</span>}
            overlayClassName="c-rc-tooltip -default"
            mouseLeaveDelay={0}
          >
            <button
              className={classnames({
                '-active': !!activeInfo,
              })}
              type="button"
              onClick={onInfo}
            >
              <i className="ng-icon-info-circle" />
            </button>
          </Tooltip>
        </div>
        <WidgetDownload data={data} />
      </div>
    );
  }
}

export default WidgetToolbarComponent;
