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

import debounce from 'lodash/debounce';
import { Store } from 'redux';

import { setLastViewedPlace } from '../modules/global/actions';
import { setMapStyle } from '../modules/map/actions';
import { IPlace } from '../modules/places/model';

export interface IEphemeralState {
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
  // Put data from sessionStorage into redux store
  if (ephemeralState) {
    if (ephemeralState.global && ephemeralState.global.lastViewedPlace) {
      store.dispatch(setLastViewedPlace(ephemeralState.global.lastViewedPlace));
    }

    ephemeralState.map && store.dispatch(setMapStyle(ephemeralState.map.mapStyle));
  }

  // subscribe to changes and save them in SessionStorage
  store.subscribe(
    debounce(() => {
      const state = store.getState();

      const keepThis: IEphemeralState = {
        global: {
          lastViewedPlace: state.global.lastViewedPlace,
        },
        map: {
          mapStyle: state.map.mapStyle,
        },
      };

      try {
        sessionStorage.setItem('ephemeral', JSON.stringify(keepThis));
      } catch (e) {
        console.log(e);
      }
    }, 1000)
  );
};
