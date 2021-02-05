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
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classNames from 'classnames';
import React from 'react';

import { MAP_SIDEBAR_WIDTH, MAP_SIDEBAR_WIDTH_WIDE } from '../../config';
import CompanyRedirect from './company-redirect';
import SidebarToggle from './sidebar-toggle';

const useStyles = makeStyles((theme) => {
  const getDrawerWidth = (props: ISidebarPanel) =>
    props.selectedOpen ? MAP_SIDEBAR_WIDTH_WIDE : MAP_SIDEBAR_WIDTH;

  return {
    drawerPaper: {
      maxHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      borderRight: 'none',
      '& .scroll-container': {
        flex: '1 1 auto',
        overflow: 'auto',
      },
    },
    drawer: (props: ISidebarPanel) => ({
      width: getDrawerWidth(props),
    }),
    drawerOpen: (props: ISidebarPanel) => ({
      width: getDrawerWidth(props),
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.down('xs')]: {
        width: 'calc(100vw - 60px)',
      },
    }),
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
    },
    sidebarToggle: {
      position: 'fixed',
      [theme.breakpoints.down('xs')]: {
        left: (props: ISidebarPanel) => (props.open ? 'calc(100vw - 60px)' : 0),
      },
      [theme.breakpoints.up('sm')]: {
        transition: theme.transitions.create('left', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        left: (props: ISidebarPanel) => (props.open ? getDrawerWidth(props) : 0),
      },
    },
  };
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

const Sidebar = (props: ISidebarPanel) => {
  const {
    children,
    layersPanel,
    open,
    resetCollection,
    resetLayers,
    resetMap,
    resetPlace,
    selectedOpen,
    setPlacesSearch,
    setSidebarOpen,
  } = props;

  const classes = useStyles(props);
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const onClose = () => setSidebarOpen(false);

  const onResetMap = () => {
    resetPlace();
    resetCollection();
    setPlacesSearch({ search: '' });
    resetLayers();
    resetMap();
  };

  const drawerProps: any = {
    ...(isSmallDevice
      ? {
          open,
          onClose,
          variant: 'temporary',
        }
      : {
          variant: 'permanent',
        }),
  };

  return (
    <>
      <Drawer
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: classNames({
            [classes.drawerPaper]: true,
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        {...drawerProps}
      >
        {children}
      </Drawer>
      <SidebarToggle
        className={classes.sidebarToggle}
        open={open}
        setSidebarOpen={setSidebarOpen}
      />
    </>
  );
};

export default Sidebar;
