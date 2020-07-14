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

import { all, select, takeLatest, put, call } from 'redux-saga/effects';

import { fetchPlaces } from 'services/places';
import { LOCATION_QUERY } from 'sagas/model';
import { preloadLayers } from 'sagas/layers';
import { nextPage } from 'sagas/places'
import { IPlace } from 'modules/places/model';
import { setPlacesSearchAvailableFilters, setPlacesCache, resetPlacesFeatured } from 'modules/places/actions';
import { resetLayerCache } from 'modules/layers/actions';
import { ignoreRedirectsTo, getGroup } from 'sagas/saga-utils';

const ignoreRedirectsToEarth = ignoreRedirectsTo('EARTH');

export default function* earth() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, loadPlaces);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, preloadLayers);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, preloadFilters);

  // WARNING - will execute on any page from the app, not just on /EARTH
  yield takeLatest(resetPlacesFeatured, loadPlaces);
  yield takeLatest(resetLayerCache, preloadLayers);
}

function* preloadFilters() {
  const { meta } = yield nextPage({
    payload: {}
  });
  yield put(setPlacesSearchAvailableFilters(meta.filters));
}

function* loadPlaces() {
  const group = yield select(getGroup);

  // PLACES
  const places: IPlace[] = yield all({
    featured: call(fetchPlaces, {
      ...LOCATION_QUERY,
      ...{ filter: 'featured==true', group: group.toString() },
    }),
  });

  yield put(setPlacesCache(places));
}