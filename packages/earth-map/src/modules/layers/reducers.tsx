import * as actions from './actions';
import initialState from './initial-state';

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
  [actions.setLayersList]: (state, { payload }) => {
    return {
      ...state,
      list: payload,
    };
  },

  [actions.toggleLayer]: (state, { payload }) => {
    const active = [...state.active];
    const slug = payload.slug || payload.layer.slug;
    return {
      ...state,
      active: active.indexOf(slug) > -1 ? active.filter((e) => e !== slug) : [slug, ...active],
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

  [actions.resetLayers]: () => {
    return initialState;
  },
  [actions.resetLayerCache]: (state, { payload }) => {
    return { ...state, list: [] };
  },
};
