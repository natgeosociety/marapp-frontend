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

import classnames from 'classnames';
import React from 'react';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import IconRecenter from 'mdi-material-ui/CrosshairsGps';

import './styles.scss';

export interface IRecenter {
  className?: string;
  onClick: () => void;
}

class RecenterControl extends React.PureComponent<IRecenter> {
  public static defaultProps = {
    className: null,
  };

  public render() {
    const { className, onClick } = this.props;

    const classNames = classnames('marapp-qa-recentercontrol c-recenter-control', {
      [className]: !!className,
    });

    return (
      <Box mb={0.5}>
        <ButtonBase onClick={onClick}>
          <Paper className={classNames}>
            <Box p={0.5}>
              <IconRecenter fontSize="small" />
            </Box>
          </Paper>
        </ButtonBase>
      </Box>
    );
  }
}

export default RecenterControl;
