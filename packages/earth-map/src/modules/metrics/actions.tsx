import { createAction } from 'vizzuality-redux-tools';

export const setMetrics = createAction('METRICS/setMetrics');
export const setMetricsLoading = createAction('METRICS/setMetricsLoading');

export default {
  setMetrics,
  setMetricsLoading,
};
