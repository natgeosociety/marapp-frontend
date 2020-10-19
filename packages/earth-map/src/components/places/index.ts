import { resetMap } from 'modules/map/actions';
import {
  nextPlacesPage,
  resetPlace,
  setPlacesSearch,
  setPlacesSearchOpen,
} from 'modules/places/actions';
import { setSidebarPanel, setSidebarPanelExpanded } from 'modules/sidebar/actions';
import { connect } from 'react-redux';

import Places from './Places';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    search: state.places.search,
    group: state.user.group,
    results: state.places.results,
    nextPageCursor: state.places.nextPageCursor,
    locationName: state.places.data.name,
    locationOrganization: state.places.data.organization,
    lastViewedPlace: state.global.lastViewedPlace,
  }),
  {
    resetMap,
    resetPlace,
    setPlacesSearch,
    nextPlacesPage,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
  }
)(Places);
