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

import { setCollectionData, setCollectionsLoading } from 'modules/collections/actions';
import { persistData, setLastViewedPlace } from 'modules/global/actions';
import { EMainType, SubType } from 'modules/global/model';
import { setMapBounds } from 'modules/map/actions';
import { setSidebarPanelExpanded } from 'modules/sidebar/actions';
import { setPlacesSearch } from 'modules/places/actions';
import { EarthRoutes } from 'modules/router/model';
import { replace } from 'redux-first-router';
import { call, put, takeLatest } from 'redux-saga/effects';
import PlacesService from 'services/PlacesService';
import { ignoreRedirectsTo } from 'sagas/saga-utils';

const ignoreRedirectsToCollection = ignoreRedirectsTo(EarthRoutes.COLLECTION);
export default function* collections() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToCollection, loadCollection);
}

function* loadCollection({ payload }) {
  const { slug, organization } = payload;

  try {
    yield put(setSidebarPanelExpanded(false));
    yield put(setCollectionsLoading(true));

    const { data } = yield call(PlacesService.fetchPlaceById, slug, {
      group: organization,
      include: 'locations',
      select: 'locations.slug,locations.name',
    });

    if (data.bbox2d.length) {
      yield put(setMapBounds({ bbox: data.bbox2d }));
    }
    yield put(setPlacesSearch({ search: data.name }));
    yield put(setCollectionData(data));
    yield put(
      setLastViewedPlace({
        id: data.id,
        name: data.name,
        slug: data.slug,
        organization: data.organization,
        mainType: EMainType.COLLECTION,
        subType: SubType.COLLECTION,
      })
    );
    yield put(setCollectionsLoading(false));
    yield put(persistData()); // to keep last viewed place
  } catch (e) {
    // TODO better error handling for sagas
    if ([403, 404].includes(e.request.status)) {
      replace('/404');
    }
    yield put(setCollectionsLoading(false));
  }
}
