import { Store } from 'redux';

import { setPlacesSearch } from 'modules/places/actions';
import { setUserGroup } from 'modules/user/actions';
import { setMapStyle } from 'modules/map/actions';
import { setLastViewedPlace } from 'modules/global/actions';

import { IPlace } from 'modules/places/model';

export interface IEphemeralState {
  places?: {
    search?: any
    filters?: any
  }
  global?: {
    lastViewedPlace?: IPlace
  }
  map?: {
    mapStyle?: string
  }
  user?: any
};

/**
 * Put state from ephemeralState back into the store at init time by dispatching actions
 */
export default (store: Store, ephemeralState: IEphemeralState): void => {

  // Put data from sessionStorage into redux store before triggering the sagas
  if (ephemeralState) {
    if (ephemeralState.places) {
      const { search, filters } = ephemeralState.places;
      const hasFilters = search.length || Object.keys(filters).length

      store.dispatch(setPlacesSearch({
        ...ephemeralState.places,
        ...hasFilters && {
          open: true
        }
      }));
    }
    if (ephemeralState.global && ephemeralState.global.lastViewedPlace) {
      store.dispatch(setLastViewedPlace(ephemeralState.global.lastViewedPlace));
    }
    ephemeralState.user && store.dispatch(setUserGroup(ephemeralState.user.group));
    ephemeralState.map && store.dispatch(setMapStyle(ephemeralState.map.mapStyle));
  }
};