import { connect } from 'react-redux';
import {
  setMapViewport,
  setMapBounds,
  setMapInteractions,
  setMapHoverInteractions,
} from 'modules/map/actions';
import { setFullscreen } from 'modules/fullscreen/actions';
import { getActiveInteractiveLayersIds } from 'modules/layers/selectors';

import MapComponent from './component';

export default connect(
  (state: any) => ({
    ...state.map,
    open: state.indexes.selected,
    activeInteractiveLayersIds: getActiveInteractiveLayersIds(state),
  }),
  {
    setFullscreen,
    setMapViewport,
    setMapBounds,
    setMapInteractions,
    setMapHoverInteractions,
  }
)(MapComponent);
