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
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { animated, Keyframes } from 'react-spring/renderprops';

import { Icon } from '@marapp/earth-shared';

import './styles.scss';

const IndexCards: any = Keyframes.Trail({
  show: { transform: 'translate(0,0)', opacity: 1 },
  open: { transform: 'translate(-500px,0)', opacity: 0.5, deplay: 500 },
  loading: { transform: 'translate(20px, 0px)', opacity: 0 },
  hide: { transform: 'translate(20px, 0px)', opacity: 0 },
});

interface IIndexes {
  loading?: boolean;
  list?: [];
  setIndexesSelected?: (any) => void;
  selected?: any;
  selectedOpen?: any;
}

class IndexesComponent extends React.PureComponent<IIndexes> {
  public getCardsState() {
    const { loading, selected, selectedOpen } = this.props;

    if (loading) {
      return 'loading';
    }

    if (selected) {
      return 'open';
    }

    return !selectedOpen ? 'show' : 'hide';
  }

  public onClickIndex = (item) => {
    const { setIndexesSelected } = this.props;

    // setIndexesSelected(item.slug);
  };

  public render() {
    const { selected, list } = this.props;

    const state = this.getCardsState();

    return (
      <div className="marapp-qa-indexes c-indexes">
        <div className="indexes--list">
          <IndexCards
            native={true}
            items={list}
            keys={list.map((_, i) => i)}
            state={state}
            selected={selected}
            config={{ tension: 250, friction: 25 }}
          >
            {(item, i) => (styles) => (
              <animated.div
                role="button"
                className={classnames('marapp-qa-indexcontainer indexes--list-item', {
                  '-active': selected === item.slug,
                  '-inactive': selected && selected !== item.slug,
                })}
                style={styles}
                onClick={() => this.onClickIndex(item)}
              >
                <h4
                  className={classnames({
                    'indexes--list-item-title': true,
                    '-open': state === 'open',
                  })}
                >
                  {item.name}
                </h4>

                <div className="indexes--list-item-icon">
                  <Icon name="icon-arrow-right-2" className="-smaller" />
                </div>
              </animated.div>
            )}
          </IndexCards>
        </div>
      </div>
    );
  }
}

export default IndexesComponent;
