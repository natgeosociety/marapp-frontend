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
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Icon, Spinner } from '@marapp/earth-shared';

// Components

interface IPlaceSelected {
  data?: { name: string };
  loading?: boolean;
  setPlaceSelectedOpen?: (b: boolean) => {};
  selectedOpen?: any;
}

class PlaceSelectedComponent extends React.PureComponent<IPlaceSelected> {
  public static propTypes = {};

  public onToggleOpen = () => {
    const { selectedOpen, setPlaceSelectedOpen } = this.props;

    setPlaceSelectedOpen(!selectedOpen);
  };

  public render() {
    const { data, loading, selectedOpen } = this.props;
    if (isEmpty(data)) {
      return null;
    }

    const { name } = data;
    const relations = SECTIONS.some((s) => data[s] && data[s].length);

    return (
      <div
        className={classnames('marapp-qa-placeselected place--selected', {
          '-no-data': !relations,
        })}
        onClick={relations ? this.onToggleOpen : undefined}
      >
        <h5>Selected place</h5>
        <h4 className="place--title">{name}</h4>

        {relations && (
          <div className="place--icon">
            <Icon
              name={selectedOpen ? 'icon-arrow-up-2' : 'icon-arrow-down-2'}
              className="-smaller"
            />
          </div>
        )}

        {/* Spinner */}
        {loading && <Spinner className="place--spinner" />}
      </div>
    );
  }
}

export default PlaceSelectedComponent;
