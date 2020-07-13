import { connect } from 'react-redux';
import SidebarLayoutSearch from './component';
import { setPlacesSearchOpen, setPlacesSearch } from 'modules/places/actions';

export default connect(
  (state: any) => ({
    ...state.indexes,
    ...state.sidebar,
    search: state.places.search,
    group: state.user.group,
    locationName: state.places.data.name,
    locationOrganization: state.places.data.organization,
    lastViewedPlace: state.global.lastViewedPlace,
  }), {
    setPlacesSearchOpen,
    setPlacesSearch,
  }
)(SidebarLayoutSearch);
