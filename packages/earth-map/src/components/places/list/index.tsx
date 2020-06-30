import { connect } from 'react-redux';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { setIndexesSelected } from 'modules/indexes/actions';
import { setPlacesSearch, setPlacesSearchResults, nextPlacesPage } from 'modules/places/actions';

import PlacesResultsComponent from './component';

export default connect(
  (state: any) => ({
    ...state.sidebar,
    list: state.indexes.list,
    loading: state.places.search.loading,
    results: state.places.results,
    nextPageCursor: state.places.nextPageCursor,
    group: state.user.group,
  }),
  {
    setSidebarPanel,
    setIndexesSelected,
    setPlacesSearch,
    setPlacesSearchResults,
    nextPlacesPage,
  }
)(PlacesResultsComponent);
