import * as actions from './actions';

export default {
  [actions.setFullscreen]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setFullscreenOpen]: (state, { payload }) => ({
    ...state,
    open: payload,
  }),
  [actions.setFullscreenData]: (state, { payload }) => ({
    ...state,
    data: payload,
  }),
};
