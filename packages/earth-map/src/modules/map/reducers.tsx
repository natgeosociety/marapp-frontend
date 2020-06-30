import * as actions from './actions';
import initialState from './initial-state';

export default {
  [actions.setMap]: (state, { payload }) => ({ ...state, ...payload }),
  [actions.setMapBounds]: (state, { payload }) => ({
    ...state,
    bounds: payload,
  }),
  [actions.setMapStyle]: (state, { payload }) => ({
    ...state,
    mapStyle: payload,
  }),
  [actions.setMapLabels]: (state, { payload }) => ({
    ...state,
    mapLabels: payload,
  }),
  [actions.setMapRoads]: (state, { payload }) => ({
    ...state,
    mapRoads: payload,
  }),
  [actions.setMapViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload,
  }),
  [actions.setMapInteractions]: (state, { payload }) => {
    const { features = [], lngLat = [] } = payload;

    const interactions = features.reduce(
      (obj, next) => ({
        ...obj,
        [next.layer.source]: {
          id: next.id,
          data: next.properties,
          geometry: next.geometry,
        },
      }),
      {}
    );

    return {
      ...state,
      latlng: {
        lat: lngLat[1],
        lng: lngLat[0],
      },
      interactions,
    };
  },
  [actions.setMapHoverInteractions]: (state, { payload }) => {
    const { features = [] } = payload;
    const hoverInteractions = features.reduce(
      (obj, next) => ({
        ...obj,
        [next.layer.source]: {
          id: next.id,
          data: next.properties,
          geometry: next.geometry,
        },
      }),
      {}
    );

    return {
      ...state,
      hoverInteractions,
    };
  },
  [actions.resetMap]: (state) => {
    const { mapStyle, mapLabels, mapRoads } = state;
    return {
      ...initialState,
      mapStyle,
      mapLabels,
      mapRoads,
    };
  },
};
