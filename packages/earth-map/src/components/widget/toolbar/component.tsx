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
