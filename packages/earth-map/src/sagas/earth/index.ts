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

import { setFeaturedCollections } from 'modules/collections/actions';
import { ICollection } from 'modules/collections/model';
import { resetLayerCache } from 'modules/layers/actions';
import {
  resetPlacesFeatured,
  setPlacesCache,
  setPlacesSearchAvailableFilters,
} from 'modules/places/actions';
import { IPlace, LocationTypeEnum } from 'modules/places/model';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { loadDataIndexes } from 'sagas/layers';
import { nextPage } from 'sagas/places';
import { getGroup, ignoreRedirectsTo } from 'sagas/saga-utils';
import PlacesService from 'services/PlacesService';

const ignoreRedirectsToEarth = ignoreRedirectsTo('EARTH');

export default function* earth() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, loadDataIndexes);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToEarth, preloadFilters);

  // WARNING - will execute on any page from the app, not just on /EARTH
  yield takeLatest(resetLayerCache, loadDataIndexes);
}

function* preloadFilters() {
  const { meta } = yield nextPage({
    payload: {},
  });
  yield put(setPlacesSearchAvailableFilters(meta.filters));
}
