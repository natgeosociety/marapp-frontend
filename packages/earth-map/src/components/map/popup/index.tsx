import { connect } from 'react-redux';

import LayerManager from './component';

import { getPopup } from 'modules/map/selectors';
import { getActiveInteractiveLayers } from 'modules/layers/selectors';

import { setMapInteractions } from 'modules/map/actions';

export default connect(
  (state: any) => ({
    popup: getPopup(state),
    layers: getActiveInteractiveLayers(state),
  }),
  { setMapInteractions }
)(LayerManager);
