/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

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
  [actions.setPlacesSearchOpen]: (state, { payload }) => {
    return {
      ...state,
      search: {
        ...state.search,
        open: payload,
      },
    };
  },
  // deprecated?
  [actions.setPlacesSearchFilters]: (state, { payload }) => ({
    ...state,
    filters: { ...state.filters, filters: payload },
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
    const filtersWithLabels = payload.map((filter) => ({
      ...filter,
      label: filter.value,
      ...(typeof filter.value === 'boolean' && {
        label: filter.value ? 'Yes' : 'No',
        value: filter.value ? 'true' : 'false',
      }),
    }));
    const availableFilters = groupBy(sortBy(filtersWithLabels, 'value'), 'key');
    return {
      ...state,
      search: {
        ...state.search,
        availableFilters,
      },
    };
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
  [actions.resetPlace]: (state, { payload }) =>
    payload?.keepCache
      ? {
          ...initialState,
          cache: {
            ...state.cache,
          },
        }
      : initialState,
  [actions.resetPlacesFeatured]: (state, { payload }) => ({
    ...state,
    cache: {
      featured: {
        data: [],
      },
    },
  }),
};
