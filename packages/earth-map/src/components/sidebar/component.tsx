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

import classNames from 'classnames';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_WIDE } from 'config';
import React from 'react';
import { animated, Keyframes } from 'react-spring/renderprops.cjs';
import { withStyles } from '@material-ui/core/styles';

import CompanyRedirect from './company-redirect';
import SidebarToggle from './sidebar-toggle';
import './styles.scss';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
});

// Creates a spring with predefined animation slots
const SidebarPanel: any = Keyframes.Spring({
  open: { x: 0, width: SIDEBAR_WIDTH, from: { x: -100 }, delay: 0 },
  openW: { x: 0, width: SIDEBAR_WIDTH_WIDE, from: { x: 0 }, delay: 0 },
  close: { x: -100, delay: 100 },
});

interface ISidebarPanel {
  panel?: string;
  children: any;
  open?: boolean;
  layersPanel?: boolean;
  selected?: string;
  setSidebarOpen?: (o: boolean) => void;
  setPlacesSearch?: (p: { search: string }) => void;
  setIndexesSelected?: (i: string) => void;
  resetMap?: () => void;
  resetPlace?: () => void;
  resetCollection?: () => void;
  resetLayers?: () => void;
  selectedOpen?: boolean;
  classes?: any;
}

class Sidebar extends React.Component<ISidebarPanel> {
  public onClose = () => {
    const { setSidebarOpen } = this.props;
    setSidebarOpen(false);
  };

  public resetMap = () => {
    const { setPlacesSearch, resetMap, resetPlace, resetCollection, resetLayers } = this.props;

    resetPlace();
    resetCollection();
    setPlacesSearch({ search: '' });
    resetLayers();
    resetMap();
  };

  public render() {
    const { children, open, selectedOpen, layersPanel, setSidebarOpen, classes } = this.props;
    let state;

    if (open) {
      state = 'open';
      if (selectedOpen) {
        state = 'openW';
      }
    } else {
      state = 'close';
    }

    return (
      <SidebarPanel native={true} state={state}>
        {({ x, ...props }) => (
          <animated.div
            className={classNames(classes.root, 'marapp-qa-sidebar c-sidebar ng-c-sidebar', {
              'no-scroll': layersPanel,
            })}
            style={{
              transform: x.interpolate((x) => `translate3d(${x}%,0,0)`),
              ...props,
            }}
          >
            {/*<CompanyRedirect />*/}
            <SidebarToggle open={open} setSidebarOpen={setSidebarOpen} />
            {children}
          </animated.div>
        )}
      </SidebarPanel>
    );
  }
}

export default withStyles(styles)(Sidebar);
