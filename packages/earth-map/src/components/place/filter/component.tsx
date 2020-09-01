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
          <div role="button" className="marapp-qa-placesectionbutton place--section -back" onClick={this.onBack}>
            <h4 className="place--title">
              <i className="ng-icon-directionleft" />
              <span>{upperFirst(selectedFilter)}</span>
            </h4>
          </div>

          <ul className="marapp-qa-placelist place--list">
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
