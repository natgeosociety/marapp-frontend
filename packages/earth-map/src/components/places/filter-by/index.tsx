import { connect } from 'react-redux';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { setIndexesList, setIndexesSelected } from 'modules/indexes/actions';

import FilterComponent from './component';
import { setPlacesSearchFilters, setPlacesSearch } from 'modules/places/actions';

export default connect(
  (state: any) => ({
    search: state.places.search,
  }),
  {
    setSidebarPanel,
    setIndexesSelected,
    setIndexesList,
    setPlacesSearchFilters,
    setPlacesSearch,
  }
)(FilterComponent);
