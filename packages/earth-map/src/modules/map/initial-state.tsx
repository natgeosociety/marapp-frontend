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
import {
  extractCoordinatesFromUrl,
  isValidLatitude,
  isValidLongitude,
  isValidZoom,
} from '../../utils/map';

const urlParams = extractCoordinatesFromUrl();

export const INITIAL_VIEW_PORT = {
  latitude: 20,
  longitude: 0,
  zoom: 2,
  minZoom: 2,
};

export default {
  viewport: {
    ...INITIAL_VIEW_PORT,
    // set initial state based on URL, otherwise s short URL flicker wold be visible
    latitude: isValidLatitude(urlParams.latitude) ? urlParams.latitude : INITIAL_VIEW_PORT.latitude,
    longitude: isValidLongitude(urlParams.longitude)
      ? urlParams.longitude
      : INITIAL_VIEW_PORT.longitude,
    zoom: isValidZoom(urlParams.zoom) ? urlParams.zoom : INITIAL_VIEW_PORT.zoom,
  },
  bounds: {},
  interactions: {},
  hoverInteractions: {},
  latlng: {},
  mapStyle: APP_BASEMAPS[0].id,
  mapLabels: true,
  mapRoads: false,
};
