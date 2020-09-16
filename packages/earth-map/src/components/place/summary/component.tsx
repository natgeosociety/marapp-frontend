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
import { SECTIONS } from 'components/place/constants';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { animated } from 'react-spring/renderprops';
import Link from 'redux-first-router-link';

// Spring

// Components

const MAX_ITEMS = 5;

interface IPlaceSummaryComponent {
  data?: {};
  style?: {};
  setPlaceSelectedFilter?: (s: any) => {};
}

class PlaceSummaryComponent extends React.PureComponent<IPlaceSummaryComponent> {
  public onChangeFilter = (filter) => {
    const { setPlaceSelectedFilter } = this.props;
    setPlaceSelectedFilter(filter);
  };

  public render() {
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
              className={classnames('marapp-qa-placesummary place--section', {
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
