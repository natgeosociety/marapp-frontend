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

import { resetLayerCache } from 'modules/layers/actions';
import {
  resetPlacesFeatured,
  setPlacesCache,
  setPlacesSearchAvailableFilters,
} from 'modules/places/actions';
import { IPlace } from 'modules/places/model';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { loadDataIndexes } from 'sagas/layers';
import { LOCATION_QUERY } from 'sagas/model';
import { nextPage } from 'sagas/places';
import { getGroup, ignoreRedirectsTo } from 'sagas/saga-utils';
import { fetchPlaces } from 'services/places';

const ignoreRedirectsToEarth = ignoreRedirectsTo('EARTH');

export default function* earth() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, loadPlaces);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, loadDataIndexes);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, preloadFilters);

  // WARNING - will execute on any page from the app, not just on /EARTH
  yield takeLatest(resetPlacesFeatured, loadPlaces);
  yield takeLatest(resetLayerCache, loadDataIndexes);
}

function* preloadFilters() {
  const { meta } = yield nextPage({
    payload: {},
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
