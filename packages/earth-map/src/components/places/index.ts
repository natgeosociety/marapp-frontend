import { resetMap } from 'modules/map/actions';
import {
  nextPlacesPage,
  resetPlace,
  setPlacesSearch,
  setPlacesSearchOpen,
} from 'modules/places/actions';
import { setSidebarPanelExpanded } from 'modules/sidebar/actions';
import { resetCollection } from 'modules/collections/actions';
import { connect } from 'react-redux';

import Places from './Places';

export default connect(
  (state: any, props: any) => ({
    ...state.sidebar,
    search: state.places.search,
    group: state.user.group,
    results: state.places.results,
    nextPageCursor: state.places.nextPageCursor,
    locationName: props.locationName || state.places.data.name,
    locationOrganization: props.locationOrganization || state.places.data.organization,
  }),
  {
    resetMap,
    resetPlace,
    resetCollection,
    setPlacesSearch,
    nextPlacesPage,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
  }
)(Places);
