import React from 'react';
import classNames from 'classnames';

import './styles.scss';

interface ISidebarClose {
  open?: boolean;
  setSidebarOpen?: (o: boolean) => void;
}

const SidebarClose = (props: ISidebarClose) => {
  const { open, setSidebarOpen } = props;

  return (
    <div className="c-sidebar-close">
      <button type="button" onClick={() => setSidebarOpen(!open)} className="sidebar--btn">
        <i
          className={classNames({
            'ng-body-color ng-text-bold ng-icon-small': true,
            'ng-icon-directionleft': open,
            'ng-icon-directionright': !open,
          })}
        />
      </button>
    </div>
  );
}

export default SidebarClose;