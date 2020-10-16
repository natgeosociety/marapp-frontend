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

import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { animated, Keyframes, Transition } from 'react-spring/renderprops.cjs';

import PlaceFilter from './filter';
import './styles.scss';
import PlaceSummary from './summary';

// Creates a keyframed spring
const PlaceWrapper: any = Keyframes.Spring({
  open: { x: 0, opacity: 1, delay: 100 },
  expanded: { x: 300, opacity: 1, delay: 0 },
  close: { x: 0, opacity: 0, delay: 100 },
});

interface IPlace {
  data?: {};
  sidebarState?: boolean;
  selectedOpen?: boolean;
  selectedFilter?: string;

  setPlaceSelectedFilter?: (s: any) => void;
}

class PlaceComponent extends React.PureComponent<IPlace> {
  public onDestroyed = () => {
    const { selectedOpen, setPlaceSelectedFilter } = this.props;

    if (!selectedOpen) {
      setPlaceSelectedFilter('');
    }
  };

  public getState = () => {
    const { data, sidebarState } = this.props;

    if (isEmpty(data)) {
      return 'close';
    }

    return sidebarState ? 'expanded' : 'open';
  };

  public render() {
    const { selectedOpen, selectedFilter } = this.props;

    const state = this.getState();

    return (
      <PlaceWrapper native={true} state={state}>
        {({ x, ...props }) => (
          <animated.div
            className="marapp-qa-place c-place"
            style={{
              transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
              ...props,
            }}
          >
            {/*<PlaceSelected />*/}

            <Transition
              native={true}
              items={selectedOpen}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={[{ opacity: 0 }]}
            >
              {(show) =>
                show &&
                ((props: any) => (
                  <animated.div className="place--content" style={props}>
                    {/* Summary */}
                    <Transition
                      native={true}
                      items={!selectedFilter}
                      from={{ transform: 'translate(0, -10px)', opacity: 0 }}
                      enter={{
                        transform: 'translate(0,0)',
                        opacity: 1,
                        delay: 0,
                      }}
                      leave={[{ transform: 'translate(0, 10px)', opacity: 0 }]}
                    >
                      {(show2) => show2 && ((props2) => <PlaceSummary style={props2} />)}
                    </Transition>

                    {/* Filter */}
                    <Transition
                      native={true}
                      items={selectedFilter}
                      from={{ transform: 'translate(0, -10px)', opacity: 0 }}
                      enter={{
                        transform: 'translate(0,0)',
                        opacity: 1,
                        delay: 0,
                      }}
                      leave={[{ transform: 'translate(0, 10px)', opacity: 0 }]}
                    >
                      {(show2) => show2 && ((props2) => <PlaceFilter style={props2} />)}
                    </Transition>
                  </animated.div>
                ))
              }
            </Transition>
          </animated.div>
        )}
      </PlaceWrapper>
    );
  }
}

export default PlaceComponent;
