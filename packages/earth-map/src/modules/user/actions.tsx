import { createAction } from 'vizzuality-redux-tools';

export const setUser = createAction('USER/setUser');
export const setUserGroup = createAction('USER/setUserGroup');

export default {
  setUser,
};
