import { connect } from 'react-redux';

import { resetMap } from '../../modules/map/actions';
import { setPlacesSearch, setPlacesSearchOpen } from '../../modules/places/actions';
import { setSidebarOpen, setSidebarPanelExpanded } from '../../modules/sidebar/actions';
import Places from './Places';

export default connect(
  (state: any, props: any) => ({
    ...state.sidebar,
    search: state.places.search,
    results: state.places.results,
    nextPageCursor: state.places.nextPageCursor,
    locationName: props.locationName,
    locationOrganization: props.locationOrganization,
  }),
  {
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setSidebarOpen,
    setPlacesSearchOpen,
  }
)(Places);
