import { connect } from 'react-redux';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { setPlacesSearchResults, nextPlacesPage } from 'modules/places/actions';

import PlacesResultsComponent from './component';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    loading: state.places.search.loading,
    results: state.places.results,
    nextPageCursor: state.places.nextPageCursor,
    group: state.user.group,
  }),
  {
    setSidebarPanel,
    setPlacesSearchResults,
    nextPlacesPage,
  }
)(PlacesResultsComponent);
