import { connect } from 'react-redux';

import { setPlaceSelectedOpen } from 'modules/places/actions';

import PlaceSelectedComponent from './component';

export default connect(
  (state: any) => ({
    ...state.places,
  }),
  { setPlaceSelectedOpen }
)(PlaceSelectedComponent);
