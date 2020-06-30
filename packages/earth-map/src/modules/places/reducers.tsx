import { groupBy, sortBy } from 'lodash';

import * as actions from './actions';
import initialState from './initial-state';

export default {
  // Cache
  [actions.setPlacesCache]: (state, { payload }) => ({
    ...state,
    cache: { ...state.loaded, ...payload },
  }),

  // Search
  [actions.setPlacesSearch]: (state, { payload }) => {
    return {
      ...state,
      search: { ...state.search, ...payload },
    };
  },
  // deprecated?
  [actions.setPlacesSearchFilters]: (state, { payload }) => ({
    ...state,
    filters: { ...state.filters, filters: payload },
  }),
  [actions.setPlacesSearchOpen]: (state, { payload }) => ({
    ...state,
    search: { ...state.search, open: payload },
  }),
  [actions.setPlacesSearchResults]: (state, { payload }) => {
    const { results, nextPageCursor } = payload;
    return {
      ...state,
      results: [...state.results, ...results],
      nextPageCursor,
    };
  },
  [actions.setPlacesSearchAvailableFilters]: (state, { payload }) => {
    // Add label and parse boolean values to strings 'true'/'false'
    const filtersWithLabels = payload.map(filter => ({
      ...filter,
      label: filter.value,
      ...typeof filter.value === 'boolean' && {
        label: filter.value
          ? 'Yes'
          : 'No',
        value: filter.value
          ? 'true'
          : 'false'
      }
    }))
    const availableFilters = groupBy(sortBy(filtersWithLabels, 'value'), 'key');
    return {
      ...state,
      search: {
        ...state.search,
        availableFilters,
      }
    }
  },
  [actions.setPlacesSearchLoading]: (state, { payload }) => ({
    ...state,
    search: { ...state.search, loading: payload },
  }),

  // Selected
  [actions.setPlaceData]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.setPlacesLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
  [actions.setPlacesError]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),

  [actions.setPlaceSelectedId]: (state, { payload }) => ({
    ...state,
    selectedId: payload,
  }),
  [actions.setPlaceSelectedOpen]: (state, { payload }) => ({
    ...state,
    selectedOpen: payload,
  }),
  [actions.setPlaceSelectedSearch]: (state, { payload }) => ({
    ...state,
    selectedSearch: payload,
  }),
  [actions.setPlaceSelectedFilter]: (state, { payload }) => ({
    ...state,
    selectedFilter: payload,
  }),
  [actions.resetPlacesResults]: (state) => ({
    ...state,
    results: [],
    nextPageCursor: null,
  }),
  [actions.resetPlace]: (state, { payload }) => initialState,
  [actions.resetPlacesFeatured]: (state, { payload }) => ({
    ...state,
    cache: {
      featured: {
        data: [],
      },
    },
  }),
};
