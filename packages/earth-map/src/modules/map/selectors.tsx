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

import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';

import { MAP_SIDEBAR_WIDTH_WIDE } from '../../config';

const latlng = (state) => state.map.latlng;
const bbox = (state) => state.map.bounds.bbox;
const sidebarOpen = (state) => state.sidebar.open;

export const getPopup = createSelector([latlng], (_latlng) => {
  if (isEmpty(_latlng) || !_latlng.lat || !_latlng.lng) {
    return {};
  }

  const popup = {
    latitude: _latlng.lat,
    longitude: _latlng.lng,
  };

  return popup;
});

export const sidebarAwareMapBounds = createSelector([bbox, sidebarOpen], (_bbox, _sidebarOpen) => ({
  bbox: _bbox,
  options: {
    padding: {
      top: 50,
      bottom: 50,
      left: _sidebarOpen ? MAP_SIDEBAR_WIDTH_WIDE + 50 : 50,
      right: 50,
    },
  },
}));

export default {
  getPopup,
  sidebarAwareMapBounds,
};
