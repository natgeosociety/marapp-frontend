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

import { Store } from 'redux';

import { setPlacesSearch } from 'modules/places/actions';
import { setLayersSearch } from 'modules/layers/actions';
import { setUserGroup } from 'modules/user/actions';
import { setMapStyle } from 'modules/map/actions';
import { setLastViewedPlace } from 'modules/global/actions';

import { IPlace } from 'modules/places/model';

export interface IEphemeralState {
  places?: {
    search?: any;
    filters?: any;
  };
  layers?: {
    search?: any;
    filters?: any;
  };
  global?: {
    lastViewedPlace?: IPlace;
  };
  map?: {
    mapStyle?: string;
  };
  user?: any;
}

/**
 * Put state from ephemeralState back into the store at init time by dispatching actions
 */
export default (store: Store, ephemeralState: IEphemeralState): void => {
  /**
   * Utility function to restore search state for either Places or Layers
   */
  const restoreSearchFor = (panel: string, setGenericSearch: (value: any) => any): void => {
    const scopedSearch = ephemeralState[panel];
    if (!scopedSearch) {
      return;
    }

    const { search, filters } = scopedSearch;
    const hasFilters = search.length || Object.keys(filters).length;

    store.dispatch(
      setGenericSearch({
        ...scopedSearch,
        ...(hasFilters && {
          open: true,
        }),
      })
    );
  };
  // Put data from sessionStorage into redux store before triggering the sagas
  if (ephemeralState) {
    restoreSearchFor('places', setPlacesSearch);
    restoreSearchFor('layers', setLayersSearch);

    if (ephemeralState.global && ephemeralState.global.lastViewedPlace) {
      store.dispatch(setLastViewedPlace(ephemeralState.global.lastViewedPlace));
    }

    ephemeralState.user && store.dispatch(setUserGroup(ephemeralState.user.group));

    ephemeralState.map && store.dispatch(setMapStyle(ephemeralState.map.mapStyle));
  }
};
