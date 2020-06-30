import { createAction } from 'vizzuality-redux-tools';

export const setLayersList = createAction('LAYERS/setLayersList');
export const setLayersLoading = createAction('LAYERS/loading');
export const setLayersError = createAction('LAYERS/setLayersError');
export const setLayersActive = createAction('LAYERS/setLayersActive');

export const toggleLayer = createAction('LAYERS/toggleLayer');
export const setLayerInfo = createAction('LAYERS/setLayerInfo');
export const setLayerOrder = createAction('LAYERS/setLayerOrder');
export const setLayerOpacity = createAction('LAYERS/setLayerOpacity');
export const setLayerVisibility = createAction('LAYERS/setLayerVisibility');
export const setLayerGroupCurrent = createAction('LAYERS/setLayerGroupCurrent');
export const setLayerTimelineCurrent = createAction('LAYERS/setLayerTimelineCurrent');
export const setLayerSettings = createAction('LAYERS/setLayerSettings');

export const resetLayers = createAction('LAYERS/resetLayers');
export const resetLayerCache = createAction('LAYERS/resetLayerCache');

export default {
  setLayersLoading,
  setLayersError,
  setLayersList,
  setLayersActive,

  toggleLayer,

  setLayerInfo,
  setLayerOrder,
  setLayerOpacity,
  setLayerVisibility,
  setLayerGroupCurrent,
  setLayerTimelineCurrent,
  setLayerSettings,

  resetLayers,
  resetLayerCache,
};
