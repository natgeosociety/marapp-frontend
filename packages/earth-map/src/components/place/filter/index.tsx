import { connect } from 'react-redux';

import { setPlaceSelectedFilter, setPlaceSelectedSearch } from 'modules/places/actions';

import PlaceFilterComponent from './component';

export default connect(
  (state: any) => ({
    ...state.places,
  }),
  { setPlaceSelectedFilter, setPlaceSelectedSearch }
)(PlaceFilterComponent);
