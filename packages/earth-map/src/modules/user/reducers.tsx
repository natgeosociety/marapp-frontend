import * as actions from './actions';

export default {
  [actions.setUser]: (state, { payload }) => {
    return ({ ...state, ...payload })
  },
  [actions.setUserGroup]: (state, { payload }) => {
    return {
      ...state,
      group: payload,
    }
  }
};
