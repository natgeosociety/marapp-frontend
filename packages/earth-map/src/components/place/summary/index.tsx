import { connect } from 'react-redux';

import { setPlaceSelectedFilter } from 'modules/places/actions';

import PlaceSummaryComponent from './component';

export default connect(
  (state: any) => ({
    ...state.places,
  }),
  { setPlaceSelectedFilter }
)(PlaceSummaryComponent);
