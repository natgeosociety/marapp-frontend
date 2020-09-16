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

import React from 'react';
import { animated, Transition } from 'react-spring/renderprops';

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
  public static defaultProps = {
    selected: null,
  };

  public onClose = () => {
    const { setIndexesSelected } = this.props;
    setIndexesSelected('');
  };

  public render() {
    const { selected, open } = this.props;
    const state = open ? 'open' : 'close';

    return (
      <Transition
        native={true}
        items={!!selected}
        from={{ x: 100, opacity: 0 }}
        enter={{ x: 0, opacity: 1, visibility: 'visible', delay: 0 }}
        leave={[{ x: 100 }, { visibility: 'hidden', immediate: true }]}
      >
        {(show) =>
          show &&
          (({ x, ...props }) => (
            <animated.div
              className="c-index-sidebar marapp-qa-indexsidebar"
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
