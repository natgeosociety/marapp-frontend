import { connect } from 'react-redux';
import EarthComponent from './component';

import { setMapInteractions } from 'modules/map/actions';
import { setFullscreen } from 'modules/fullscreen/actions';

export default connect(
  (state: any) => ({
    ...state.indexes,
    ...state.sidebar,
  }),
  { setMapInteractions, setFullscreen }
)(EarthComponent);
