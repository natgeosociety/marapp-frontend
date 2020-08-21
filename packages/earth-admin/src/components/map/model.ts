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

import { APP_BASEMAPS } from '../../theme';

export const MAP_DEFAULT = {
  viewport: {
    zoom: 2,
    minZoom: 2,
    maxZoom: 12,
  },
  bounds: {},
  interactions: {},
  hoverInteractions: {},
  latlng: {},
  mapStyle: APP_BASEMAPS[0].id,
  mapLabels: true,
  mapRoads: false,
};

export const LAYER_DEFAULT = {
  name: 'admin layer',
  id: 'admin-layer',
  slug: 'admin-layer',
  type: 'geojson',
  provider: 'mapbox',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[65.824585, 53.926986]],
          },
        },
      ],
    },
  },
  render: {
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#000',
          'fill-opacity': 0.25,
        },
      },
      {
        type: 'line',
        paint: {
          'line-color': '#000',
          'line-width': 2,
        },
      },
    ],
  },
};
