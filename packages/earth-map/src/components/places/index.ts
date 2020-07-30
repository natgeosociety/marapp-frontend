import { connect } from 'react-redux';

import Places from './component';
import { setSidebarPanel, setSidebarPanelExpanded } from 'modules/sidebar/actions';
import { resetPlace, setPlacesSearch } from 'modules/places/actions';
import { setIndexesSelected } from 'modules/indexes/actions';
import { resetMap } from 'modules/map/actions';

export default connect((state: any) => ({
  ...state.sidebar,
  search: state.places.search,
  group: state.user.group,
  locationName: state.places.data.name,
  locationOrganization: state.places.data.organization,
  lastViewedPlace: state.global.lastViewedPlace,
}), {
  resetMap,
  resetPlace,
  setPlacesSearch,
  setIndexesSelected,
  setSidebarPanel,
  setSidebarPanelExpanded,
})(Places);