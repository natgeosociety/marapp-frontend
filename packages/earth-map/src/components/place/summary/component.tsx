import React from 'react';
import classnames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import sortBy from 'lodash/sortBy';

// Spring
import { animated } from 'react-spring/renderprops';

// Components
import Link from 'redux-first-router-link';

import { SECTIONS } from 'components/place/constants';

const MAX_ITEMS = 5;

interface IPlaceSummaryComponent {
  data?: {};
  style?: {};
  setPlaceSelectedFilter?: (s: any) => {};
}

class PlaceSummaryComponent extends React.PureComponent<IPlaceSummaryComponent> {
  onChangeFilter = (filter) => {
    const { setPlaceSelectedFilter } = this.props;
    setPlaceSelectedFilter(filter);
  };

  render() {
    const { data, style } = this.props;

    return (
      <animated.div className="place--content-animated" style={style}>
        {SECTIONS.map((key) => {
          if (!data[key] || !data[key].length) {
            return null;
          }
          const reachedMax = data[key].length > MAX_ITEMS;

          return (
            <div
              key={key}
              className={classnames({
                'place--section': true,
                '-link': reachedMax,
              })}
              onClick={() => reachedMax && this.onChangeFilter(key)}
            >
              <h4 className="place--title">{upperFirst(key)}</h4>

              {!reachedMax && (
                <ul className="place--list">
                  {sortBy(data[key], 'name').map((place) => (
                    <li key={place.slug} className="place--item">
                      <Link
                        to={{
                          type: 'EARTH',
                          payload: { slug: place.slug, id: place.id },
                        }}
                      >
                        <h5>{place.name}</h5>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {reachedMax && (
                <React.Fragment>
                  <span>{data[key].length}</span>
                  <div className="place--icon">
                    <i className="ng-icon-directionright" />
                  </div>
                </React.Fragment>
              )}
            </div>
          );
        })}
      </animated.div>
    );
  }
}

export default PlaceSummaryComponent;
