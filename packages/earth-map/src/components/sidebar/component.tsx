import React from 'react';
import {Keyframes, animated} from 'react-spring/renderprops';
import classNames from 'classnames';

import SidebarToggle from './sidebar-toggle';

import './styles.scss';

// Creates a spring with predefined animation slots
const SidebarPanel: any = Keyframes.Spring({
  open: { x: 0, width: 375, from: { x: -100 }, delay: 0 },
  openW: { x: 0, width: 500, from: { x: 0 }, delay: 0 },
  close: [
    { x: -100, delay: 100 },
  ],
});

interface ISidebarPanel {
  panel?: string;
  children: any;
  open?: boolean;
  layersPanel?: boolean;
  selected?: string;
  setSidebarPanel?: (s: string) => void;
  setSidebarOpen?: (o: boolean) => void;
  setPlacesSearch?: (p: { search: string }) => void;
  setIndexesSelected?: (i: string) => void;
  resetMap?: () => void;
  resetPlace?: () => void;
  resetLayers?: () => void;
}

class Sidebar extends React.Component<ISidebarPanel> {
  private sidebarPanel: any;

  componentWillUnmount() {
    const {setSidebarOpen} = this.props;
    setSidebarOpen(false);
  }

  onClose = () => {
    const {setSidebarOpen} = this.props;
    setSidebarOpen(false);
  };

  resetMap = () => {
    const {
      setPlacesSearch,
      setIndexesSelected,
      resetMap,
      resetPlace,
      resetLayers,
    } = this.props;

    resetPlace();
    setPlacesSearch({search: ''});
    setIndexesSelected('');
    resetLayers();
    resetMap();
  };

  render() {
    const {
      children,
      open,
      selected,
      layersPanel,
      setSidebarOpen,
    } = this.props;
    let state;
    if (open) {
      state = 'open';
      if (!!selected) state = 'openW';
    } else {
      state = 'close';
    }

    return (
      <SidebarPanel native state={state}>
        {({ x, ...props }) => (
          <animated.div
            className={classNames({
              'c-sidebar': true,
              'ng-c-sidebar': true,
              'ng-subsection-background': true,
              'no-scroll': layersPanel,
            })}
            style={{
              transform: x.interpolate((x) => `translate3d(${x}%,0,0)`),
              ...props,
            }}
          >
            <SidebarToggle
              open={open}
              setSidebarOpen={setSidebarOpen} />
            {children}
          </animated.div>
        )}
      </SidebarPanel>
    );
  }
}

export default Sidebar;
