import { createAction } from 'vizzuality-redux-tools';

export const setWidgets = createAction('LOCATIONS/setWidgets');
export const setWidgetsLoading = createAction('LOCATIONS/setWidgetsLoading');
export const setWidgetsError = createAction('LOCATIONS/setWidgetsError');

export default {
  setWidgets,
  setWidgetsLoading,
  setWidgetsError,
};
