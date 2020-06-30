import * as actions from './actions';

export default {
  [actions.setWidget]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.setWidgetLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
  [actions.setWidgetError]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
};
