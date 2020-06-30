import { connect } from 'react-redux';
import {
  setLayerInfo,
  setLayerOrder,
  setLayerOpacity,
  setLayerVisibility,
  setLayerGroupCurrent,
  setLayerSettings,
  toggleLayer,
} from 'modules/layers/actions';

import { getLegendLayers } from 'modules/layers/selectors';

import LegendComponent from './component';

export default connect(
  (state: any) => ({
    layerGroups: getLegendLayers(state),
    ...state.sidebar,
    ...state.indexes,
  }),
  {
    setLayerInfo,
    setLayerOrder,
    setLayerOpacity,
    setLayerVisibility,
    setLayerGroupCurrent,
    setLayerSettings,
    toggleLayer,
  }
)(LegendComponent);
