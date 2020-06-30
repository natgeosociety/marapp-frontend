import * as actions from './actions';

export default {
  [actions.setWidgets]: (state, { payload }) => ({ ...state, list: payload }),
  [actions.setWidgetsLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
  [actions.setWidgetsError]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
};
