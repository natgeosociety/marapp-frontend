import * as actions from './actions';

export default {
  [actions.setIndexes]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setIndexesList]: (state, { payload }) => ({
    ...state,
    list: payload,
  }),
  [actions.setIndexesSelected]: (state, { payload }) => ({
    ...state,
    selected: payload,
  }),
};
