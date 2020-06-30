import { connect } from 'react-redux';

// Actions
import { setMapStyle } from 'modules/map/actions';
import { persistData } from 'modules/global/actions';

// Components
import BasemapComponent from './component';

export default connect(
  (state: any) => ({
    mapStyle: state.map.mapStyle,
  }),
  { setMapStyle, persistData }
)(BasemapComponent);
