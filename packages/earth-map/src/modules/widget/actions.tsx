import { createAction } from 'vizzuality-redux-tools';

export const setWidget = createAction('LOCATIONS/setWidget');
export const setWidgetLoading = createAction('LOCATIONS/setWidgetLoading');
export const setWidgetError = createAction('LOCATIONS/setWidgetError');

export default {
  setWidget,
  setWidgetLoading,
  setWidgetError,
};
