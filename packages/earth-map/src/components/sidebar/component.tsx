import React from 'react';

import './styles.scss';

import { Keyframes, animated } from 'react-spring';
import classNames from 'classnames';

const Sidebar: any = Keyframes.Spring({
  close: { x: 0, delay: 50 },
  open: { x: 375, opacity: 1, from: { x: -100, opacity: 0 }, delay: 0 },
  openW: { x: 500, opacity: 1 },
});

interface ISidebar {
  items?: Array<{}>;
  open?: boolean;
  panel?: string;
  setSidebarPanel?: (selected: any) => void;
  setSidebarOpen?: (o: boolean) => void;
  selected?: string;
}

class SidebarComponent extends React.Component<ISidebar> {
  static defaultProps = {
    panel: null,
    items: [],
  };
  private sidebarPanel: any;

  onClickItem = () => {
    const { setSidebarOpen, open } = this.props;
    setSidebarOpen(!open);
  };

  render() {
    const { open, selected } = this.props;

    let state;
    if (open) {
      state = 'open';
      if (!!selected) state = 'openW';
    } else {
      state = 'close';
    }

    return (
      <Sidebar native state={state}>
        {({ x, opacity, ...props }) => (
          <animated.div
            ref={(r) => {
              this.sidebarPanel = r;
            }}
            className="c-sidebar"
            style={{
              transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
              ...props,
            }}
          >
            <button type="button" onClick={() => this.onClickItem()} className="sidebar--btn">
              <i
                className={classNames({
                  'ng-body-color ng-text-bold ng-icon-small': true,
                  'ng-icon-directionleft': open,
                  'ng-icon-directionright': !open,
                })}
              />
            </button>
          </animated.div>
        )}
      </Sidebar>
    );
  }
}

export default SidebarComponent;
