import { connect } from 'react-redux';
import { getActiveInteractiveLayer, getActiveInteractiveLayers } from 'modules/layers/selectors';

import LayerPopupComponent from './component';

export default connect((state: any) => ({
  activeInteractiveLayer: getActiveInteractiveLayer(state),
  activeInteractiveLayers: getActiveInteractiveLayers(state),
}))(LayerPopupComponent);
