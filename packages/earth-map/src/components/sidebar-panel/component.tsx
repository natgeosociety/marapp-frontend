import React from 'react';
import Link from 'redux-first-router-link';
import { Keyframes, animated } from 'react-spring';
import classNames from 'classnames';

import './styles.scss';

import OrgSwitcher from 'components/org-switcher';

import { APP_NAME, APP_LOGO } from '../../theme';

// Creates a spring with predefined animation slots
const SidebarPanel: any = Keyframes.Spring({
  open: { x: 0, opacity: 1, width: 375, from: { x: -100, opacity: 0 }, delay: 0 },
  openW: { x: 0, opacity: 1, width: 500, from: { x: 0, opacity: 0 }, delay: 0 },
  close: [
    { x: -120, delay: 100 },
    { opacity: 0, immediate: true },
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

class SidebarPanelComponent extends React.Component<ISidebarPanel> {
  private sidebarPanel: any;

  componentWillUnmount() {
    const { setSidebarOpen } = this.props;
    setSidebarOpen(false);
  }

  onClose = () => {
    const { setSidebarOpen } = this.props;
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
    setPlacesSearch({ search: '' });
    setIndexesSelected('');
    resetLayers();
    resetMap();
  };

  render() {
    const { children, open, selected, layersPanel } = this.props;
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
            ref={(r) => {
              this.sidebarPanel = r;
            }}
            className={classNames({
              'c-sidebar-panel': true,
              'ng-subsection-background': true,
              'no-scroll': layersPanel,
            })}
            style={{
              transform: x.interpolate((x) => `translate3d(${x}%,0,0)`),
              ...props,
            }}
          >
            <div className="ng-padding-medium-horizontal ng-ep-background-dark ng-flex ng-flex-middle ng-position-relative ng-padding-bottom ng-padding-small-top">
              <Link
                className="ng-border-remove"
                to={{
                  type: 'EARTH',
                }}
              >
                <img
                  src={APP_LOGO}
                  alt={APP_NAME}
                  className="ng-margin-remove ng-display-block"
                  onClick={this.resetMap}
                />
              </Link>
              <span className="ng-ep-kicker"></span>
              <OrgSwitcher />
            </div>
            {children}
          </animated.div>
        )}
      </SidebarPanel>
    );
  }
}

export default SidebarPanelComponent;
