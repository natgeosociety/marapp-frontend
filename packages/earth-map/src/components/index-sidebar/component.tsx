import * as React from 'react';

import {Transition, animated} from 'react-spring/renderprops'

import IndexContent from '../index-content';

import './styles.scss';

interface IndexSidebar {
  native?: boolean;
  selected?: string;
  setIndexesSelected?: (any) => void;
  children?: any;
  open?: boolean;
}

class IndexSidebarComponent extends React.Component<IndexSidebar> {
  static defaultProps = {
    selected: null,
  };

  onClose = () => {
    const { setIndexesSelected } = this.props;
    setIndexesSelected('');
  };

  render() {
    const { selected, open } = this.props;
    const state = open ? 'open' : 'close';

    return (
      <Transition
        native
        items={!!selected}
        from={{ x: 100, opacity: 0 }}
        enter={{ x: 0, opacity: 1, visibility: 'visible', delay: 0 }}
        leave={[{ x: 100 }, { visibility: 'hidden', immediate: true }]}
      >
        {show =>
          show &&
          (({ x, ...props }) => (
            <animated.div
              className="c-index-sidebar"
              // @ts-ignore
              style={{
                ...props,
              }}
            >
              <IndexContent state={state} selected={selected} />
            </animated.div>
          ))
        }
      </Transition>
    );
  }
}

export default IndexSidebarComponent;
