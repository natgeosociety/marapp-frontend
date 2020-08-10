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
import { flattenLayerConfig } from 'sagas/saga-utils';

export default {
  [actions.setLayersLoading]: (state, { payload }) => ({
    ...state,
    loading: payload,
  }),
  [actions.setLayersError]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [actions.setLayersActive]: (state, { payload }) => ({
    ...state,
    active: payload,
  }),
  [actions.resetLayersActive]: (state) => ({
    ...state,
    active: [],
    listActive: [],
  }),
  [actions.setListActiveLayers]: (state, { payload }) => ({
    ...state,
    listActive: payload,
  }),
  [actions.setLayersList]: (state, { payload }) => {
    return {
      ...state,
      list: payload,
    };
  },

  [actions.toggleLayer]: (state, { payload }) => {
    const { listActive } = state;
    const layer = payload;
    const newActiveLayers = (listActive.find(x => x.slug === layer.slug))
      ? listActive.filter(x => x.slug !== layer.slug)
      : [...listActive, layer];

    return {
      ...state,
      active: newActiveLayers.map(x => x.slug),
      listActive: newActiveLayers ,
    };
  },
  [actions.setLayerOrder]: (state, { payload }) => {
    const { active } = state;
    const { datasetIds } = payload;

    const activeFiltered = active.filter((a) => !datasetIds.includes(a));

    return { ...state, active: [...datasetIds, ...activeFiltered] };
  },
  [actions.setLayerOpacity]: (state, { payload }) => {
    const oldSettings = state.settings;
    const { slug, opacity } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        opacity,
      },
    };

    return { ...state, settings };
  },
  [actions.setLayerInfo]: (state, { payload }) => {
    const oldSettings = state.settings;
    const { slug, info } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        info,
      },
    };

    return { ...state, settings };
  },
  [actions.setLayerVisibility]: (state, { payload }) => {
    const oldSettings = state.settings;
    const { slug, visibility } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        visibility,
      },
    };

    return { ...state, settings };
  },
  [actions.setLayerGroupCurrent]: (state, { payload }) => {
    const oldSettings = state.settings;
    const { slug, current } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        current,
      },
    };

    return { ...state, settings };
  },

  [actions.setLayerTimelineCurrent]: (state, { payload }) => {
    const oldSettings = state.settings;
    const { slug, current, year } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        params: { year: year },
        decodeParams: payload.settings.decodeConfig,
        timelineParams: payload.settings.timelineConfig,
        current,
      },
    };

    return { ...state, settings };
  },

  [actions.setLayerSettings]: (state, { payload }) => {
    const { settings: oldSettings } = state;
    const { settings: newSettings, slug } = payload;

    const settings = {
      ...oldSettings,
      [slug]: {
        ...oldSettings[slug],
        ...newSettings,
      },
    };

    return { ...state, settings };
  },

  // Search
  [actions.setLayersSearch]: (state, { payload }) => {
    return {
      ...state,
      search: { ...state.search, ...payload },
    };
  },

  [actions.setLayersSearchOpen]: (state, { payload }) => {
    return {
      ...state,
      search: {
        ...state.search,
        open: payload,
      },
    };
  },

  // exactly the same code from actions.setPlacesSearchAvailableFilters
  [actions.setLayersSearchAvailableFilters]: (state, { payload }) => {
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
  [actions.setLayersSearchResults]: (state, { payload }) => {
    const { results, nextPageCursor } = payload;
    return {
      ...state,
      results: [...state.results, ...results.map(flattenLayerConfig)],
      nextPageCursor,
    };
  },
  [actions.resetLayersResults]: (state) => ({
    ...state,
    results: [],
    nextPageCursor: null,
  }),
  // Search end

  [actions.resetLayers]: () => {
    return initialState;
  },
  [actions.resetLayerCache]: (state, { payload }) => {
    return { ...state, list: [] };
  },
};
