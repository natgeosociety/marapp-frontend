import * as actions from './actions';

export default {
  [actions.setSidebar]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setSidebarOpen]: (state, { payload }) => ({
    ...state,
    open: payload,
  }),
  [actions.setSidebarPanel]: (state, { payload }) => ({
    ...state,
    panel: payload,
  }),
  [actions.setSidebarLayers]: (state, { payload }) => ({ ...state, layersPanel: payload }),
};
