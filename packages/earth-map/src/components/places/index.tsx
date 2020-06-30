import { connect } from 'react-redux';

import PlacesComponent from './component';

import { setPlacesSearchFilters, setPlacesSearch } from 'modules/places/actions';
import { setIndexesSelected } from 'modules/indexes/actions';

export default connect(
  (state: any) => ({
    search: state.places ? state.places.search : {},
    featured: state.places.cache ? state.places.cache.featured : [],
    ...state.indexes,
  }),
  { setPlacesSearchFilters, setPlacesSearch, setIndexesSelected }
)(PlacesComponent);
