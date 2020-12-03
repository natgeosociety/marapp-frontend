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

import * as actions from './actions';
import initialState, { INITIAL_VIEW_PORT } from './initial-state';

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
      viewport: INITIAL_VIEW_PORT,
      mapStyle,
      mapLabels,
      mapRoads,
    };
  },
};
