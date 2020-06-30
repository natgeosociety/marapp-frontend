import * as actions from './actions';

export default {
  [actions.setMetrics]: (state, { payload }) => ({
    ...state,
    metrics: payload,
  }),
  [actions.setMetricsLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
};
