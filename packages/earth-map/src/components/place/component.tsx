import React from 'react';
import isEmpty from 'lodash/isEmpty';

import { Transition, Keyframes, animated } from 'react-spring'

import PlaceSummary from './summary';
import PlaceFilter from './filter';

// styles
import './styles.scss';

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
  onDestroyed = () => {
    const { selectedOpen, setPlaceSelectedFilter } = this.props;

    if (!selectedOpen) {
      setPlaceSelectedFilter('');
    }
  };

  getState = () => {
    const { data, sidebarState } = this.props;

    if (isEmpty(data)) {
      return 'close';
    }

    return sidebarState ? 'expanded' : 'open';
  };

  render() {
    const { selectedOpen, selectedFilter } = this.props;

    const state = this.getState();

    return (
      <PlaceWrapper native state={state}>
        {({ x, ...props }) => (
          <animated.div
            className="c-place"
            style={{
              transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
              ...props,
            }}
          >
            {/*<PlaceSelected />*/}

            <Transition
              native
              items={selectedOpen}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={[{ opacity: 0 }]}
            >
              {show =>
                show &&
                ((props: any) => (
                  <animated.div className="place--content" style={props}>
                    {/* Summary */}
                    <Transition
                      native
                      items={!selectedFilter}
                      from={{ transform: 'translate(0, -10px)', opacity: 0 }}
                      enter={{
                        transform: 'translate(0,0)',
                        opacity: 1,
                        delay: 0,
                      }}
                      leave={[{ transform: 'translate(0, 10px)', opacity: 0 }]}
                    >
                      {show2 => show2 && (props2 => <PlaceSummary style={props2} />)}
                    </Transition>

                    {/* Filter */}
                    <Transition
                      native
                      items={selectedFilter}
                      from={{ transform: 'translate(0, -10px)', opacity: 0 }}
                      enter={{
                        transform: 'translate(0,0)',
                        opacity: 1,
                        delay: 0,
                      }}
                      leave={[{ transform: 'translate(0, 10px)', opacity: 0 }]}
                    >
                      {show2 => show2 && (props2 => <PlaceFilter style={props2} />)}
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
