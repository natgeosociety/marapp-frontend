import { Store } from 'redux';

import { setPlacesSearch } from 'modules/places/actions';
import { setUserGroup } from 'modules/user/actions';
import { setMapStyle } from 'modules/map/actions';
import { setLastViewedPlace } from 'modules/global/actions';

/**
 * Put state from ephemeralState back into the store at init time by dispatching actions
 */
export default (store: Store, ephemeralState): void => {

  // Put data from sessionStorage into redux store before triggering the sagas
  if (ephemeralState) {
    if (ephemeralState.sidebarState) {
      const { search, filters } = ephemeralState.sidebarState;
      const hasFilters = search.length || Object.keys(filters).length

      store.dispatch(setPlacesSearch({
        ...ephemeralState.sidebarState,
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