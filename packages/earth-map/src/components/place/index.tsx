import { connect } from 'react-redux';

import { setPlaceSelectedFilter } from 'modules/places/actions';

import PlacesComponent from './component';

export default connect(
  (state: any) => ({
    ...state.places,
    sidebarState: !!state.sidebar.panel,
  }),
  { setPlaceSelectedFilter }
)(PlacesComponent);
