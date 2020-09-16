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

import { serializeFilters } from '@marapp/earth-shared';
import { persistData } from 'modules/global/actions';
import {
  nextPlacesPage,
  resetPlacesResults,
  setPlacesSearch,
  setPlacesSearchAvailableFilters,
  setPlacesSearchLoading,
  setPlacesSearchResults,
} from 'modules/places/actions';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { getGroup, getPlaces } from 'sagas/saga-utils';
import { fetchPlaces } from 'services/places';

import { LOCATION_QUERY } from '../model';

// Services

// Actions

export default function* places() {
  yield all([takeLatest(setPlacesSearch, searchPlaces), takeLatest(nextPlacesPage, nextPage)]);
}

/**
 * Search places by title
 */
function* searchPlaces(params) {
  // reset results every time the filters change
  yield put(resetPlacesResults());
  const { meta } = yield nextPage(params);
  yield put(setPlacesSearchAvailableFilters(meta.filters));
  yield put(persistData());
}

/**
 * Used to retrieve a page of results
 */
export function* nextPage({ payload }) {
  const group = yield select(getGroup);
  const { search } = yield select(getPlaces);
  const { filters, search: userInput } = search;
  const { pageCursor, pageSize } = payload;

  const filterQuery = serializeFilters(filters);

  yield put(setPlacesSearchLoading(true));
  const page = yield call(fetchPlaces, {
    ...LOCATION_QUERY,
    ...(!!userInput && { search: userInput }),
    ...(!!filters && { filter: filterQuery }),
    'page[cursor]': pageCursor ? pageCursor : -1,
    ...(pageSize && { page: { size: pageSize } }),
    group: group.toString(),
  });
  const { data: results, meta } = page;

  yield put(
    setPlacesSearchResults({
      results,
      nextPageCursor: meta.pagination.nextCursor,
    })
  );

  yield put(setPlacesSearchLoading(false));

  return page;
}
