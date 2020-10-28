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

import { persistData, setLastViewedPlace } from 'modules/global/actions';
import {
  setCollectionData,
  setCollectionsLoading,
  setCollectionsError,
} from 'modules/collections/actions';
import { setPlacesSearch } from 'modules/places/actions';
import { takeLatest, call, put } from 'redux-saga/effects';

import { fetchCollection } from 'services/CollectionsService';

export default function* collections() {
  // @ts-ignore
  yield takeLatest('COLLECTION', loadCollection);
}

function* loadCollection({ payload }) {
  const { slug, organization } = payload;

  try {
    yield put(setCollectionsLoading(true));
    const { data } = yield call(fetchCollection, slug, {
      group: organization,
    });
    yield put(setPlacesSearch({ search: data.name }));
    yield put(setCollectionData(data));
    // yield put(
    //   setLastViewedPlace({
    //     id: data.id,
    //     name: data.name,
    //     slug: data.slug,
    //     organization: data.organization,
    //     type: data.type,
    //   })
    // );
    yield put(setCollectionsLoading(false));
  } catch (e) {
    yield put(setCollectionsLoading(false));
  }
}
