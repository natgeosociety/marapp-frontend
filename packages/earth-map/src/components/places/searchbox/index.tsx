import { connect } from 'react-redux';

import { resetPlace, setPlacesSearch, setPlacesSearchOpen } from 'modules/places/actions';
import { setRouter } from 'modules/router/actions';
import SearchBoxComponent from './component';
import { setSidebarLayers } from 'modules/sidebar/actions';
import { setIndexesSelected } from 'modules/indexes/actions';
import { resetMap } from 'modules/map/actions';

export default connect(
  (state: any) => ({
    ...state.places.search,
  }),
  {
    setRouter,
    setPlacesSearch,
    setSidebarLayers,
    setIndexesSelected,
    setPlacesSearchOpen,
    resetMap,
    resetPlace,
  }
)(SearchBoxComponent);
