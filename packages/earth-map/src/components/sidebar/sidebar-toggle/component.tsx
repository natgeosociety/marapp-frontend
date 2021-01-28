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

import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import ToggleIcon from 'material-ui-toggle-icon';
import IconLeft from 'mdi-material-ui/ChevronLeft';
import IconRight from 'mdi-material-ui/ChevronRight';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
    display: 'flex',
    justifyContent: 'center',
    top: theme.spacing(5),
    width: theme.spacing(5),
    height: theme.spacing(6),
    zIndex: 9,
  },
  button: {
    width: theme.spacing(5),
    backgroundColor: theme.palette.grey['600'],
    transition: 'all 0.3s ease',
  },
}));

interface ISidebarToggle {
  className?: any;
  open?: boolean;
  setSidebarOpen?: (o: boolean) => void;
}

const SidebarToggle = (props: ISidebarToggle) => {
  const { className, open, setSidebarOpen } = props;
  const classes = useStyles();

  return (
    <div className={classNames(className, classes.root, 'marapp-qa-sidebarclose')}>
      <button type="button" onClick={() => setSidebarOpen(!open)} className={classes.button}>
        <ToggleIcon
          on={open}
          onIcon={<IconLeft color="primary" />}
          offIcon={<IconRight color="primary" />}
        />
      </button>
    </div>
  );
};

export default SidebarToggle;
