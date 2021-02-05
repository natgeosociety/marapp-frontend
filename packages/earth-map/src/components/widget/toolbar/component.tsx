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

import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import ToggleIcon from 'material-ui-toggle-icon';
import IconInfo from 'mdi-material-ui/InformationOutline';
import IconRemoveLayer from 'mdi-material-ui/LayersOffOutline';
import IconAddLayer from 'mdi-material-ui/LayersPlus';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import WidgetDownload from '../download';
import './styles.scss';

class WidgetToolbarComponent extends PureComponent<any, any> {
  public static propTypes = {
    active: PropTypes.bool,
    collapsed: PropTypes.bool,
    className: PropTypes.string,
    activeInfo: PropTypes.bool.isRequired,
    activeShare: PropTypes.bool.isRequired,
    activeDownload: PropTypes.bool.isRequired,
    layers: PropTypes.any,
    onDownload: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onToggleLayer: PropTypes.func.isRequired,
  };

  public static defaultProps = {
    className: '',
  };

  public render() {
    const { className, active, collapsed, layers, onToggleLayer, onInfo, data } = this.props;

    const classNames = classnames({
      [className]: !!className,
    });

    return (
      <Box
        ml={1}
        display="flex"
        alignItems="center"
        flexDirection="row"
        className={`marapp-qa-widgettoolbar  ${classNames}`}
      >
        {collapsed && !!layers?.length ? (
          <Fade in={true}>
            <IconButton onClick={onToggleLayer} className="marapp-qa-show-remove-layer">
              <ToggleIcon
                on={active}
                onIcon={<IconRemoveLayer fontSize="small" />}
                offIcon={<IconAddLayer fontSize="small" />}
              />
            </IconButton>
          </Fade>
        ) : null}

        {!isEmpty(data) && <WidgetDownload data={data} />}
        <IconButton onClick={onInfo} className="marapp-qa-widget-info">
          <IconInfo fontSize="small" />
        </IconButton>
      </Box>
    );
  }
}

export default WidgetToolbarComponent;
