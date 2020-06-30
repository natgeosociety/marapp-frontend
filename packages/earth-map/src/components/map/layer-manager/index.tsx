import { connect } from 'react-redux';

import LayerManager from './component';

import { getActiveLayers, getActiveBoundsLayer } from 'modules/layers/selectors';

export default connect(state => ({
  bounds: getActiveBoundsLayer(state),
  layers: getActiveLayers(state),
}))(LayerManager);
