import React from 'react';
import upperFirst from 'lodash/upperFirst';
import sortBy from 'lodash/sortBy';

// Spring
import { animated } from 'react-spring/renderprops';

// Components
import Link from 'redux-first-router-link';
import Filter from 'components/filter';

interface IPlaceFilter {
  data?: {};
  style: any;
  setPlaceSelectedFilter?: (s: any) => void;
  setPlaceSelectedSearch?: () => void;
  selectedFilter?: any;
  selectedSearch?: any;
}

class PlaceFilterComponent extends React.Component<IPlaceFilter, any> {
  // Prevent content during transition
  shouldComponentUpdate(nextProps) {
    const { selectedFilter } = nextProps;

    return selectedFilter;
  }

  onBack = (search) => {
    const { setPlaceSelectedFilter } = this.props;
    setPlaceSelectedFilter('');
  };

  render() {
    const { data, selectedFilter, selectedSearch, style } = this.props;

    return (
      <animated.div className="place--content-animated" style={style}>
        <div className="place--filter">
          <div role="button" className="place--section -back" onClick={this.onBack}>
            <h4 className="place--title">
              <i className="ng-icon-directionleft" />
              <span>{upperFirst(selectedFilter)}</span>
            </h4>
          </div>

          <ul className="place--list">
            <Filter filter={selectedSearch} keys={['name']} items={data[selectedFilter]}>
              {({ items }) =>
                sortBy(items, 'name').map((place) => (
                  <li key={place.slug} className="place--item -block">
                    <Link
                      to={{
                        type: 'EARTH',
                        payload: { slug: place.slug, id: place.id },
                      }}
                    >
                      <h5>{place.name}</h5>
                    </Link>
                  </li>
                ))
              }
            </Filter>
          </ul>
        </div>
      </animated.div>
    );
  }
}

export default PlaceFilterComponent;
