import { connect } from 'react-redux';
import { setSidebarPanel, setSidebarOpen } from 'modules/sidebar/actions';
import { setUser } from 'modules/user/actions';
import { resetPlace, setPlacesSearch } from 'modules/places/actions';
import { setIndexesSelected } from 'modules/indexes/actions';
import { resetMap } from 'modules/map/actions';
import { resetLayers } from 'modules/layers/actions';

import SidebarComponent from './component';


export default connect(
  (state: any) => ({
    ...state.sidebar,
    ...state.indexes,
  }),
  {
    setSidebarPanel,
    setSidebarOpen,
    setUser,
    setPlacesSearch,
    setIndexesSelected,
    resetMap,
    resetPlace,
    resetLayers,
  }
)(SidebarComponent);
