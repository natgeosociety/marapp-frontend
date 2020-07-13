import * as actions from './actions';

export default {
  [actions.persistData]: (state, { payload }) => {
    return state;
  },
  [actions.setLastViewedPlace]: (state, { payload }) => {
    return {
      ...state,
      lastViewedPlace: payload,
    }
  }
};
