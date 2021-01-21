import { connect } from 'react-redux';

import { resetCollection } from '../../modules/collections/actions';
import { resetMap } from '../../modules/map/actions';
import { resetPlace, setPlacesSearch, setPlacesSearchOpen } from '../../modules/places/actions';
import { setSidebarPanelExpanded, setSidebarOpen } from '../../modules/sidebar/actions';
import { setSidebarPanelExpanded } from '../../modules/sidebar/actions';
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
    setSidebarPanelExpanded,
    setSidebarOpen,
    setPlacesSearchOpen,
  }
)(Places);
