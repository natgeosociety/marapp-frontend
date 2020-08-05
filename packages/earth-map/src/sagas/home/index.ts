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

import { takeLatest, put, all, call, cancelled, select } from 'redux-saga/effects';

// Services
import { fetchPlaces } from 'services/places';

// Actions
import {
  setPlaceSelectedOpen,
  setPlacesLoading,
  setPlacesError,
} from '../../modules/places/actions';
import { getGroup } from 'sagas/saga-utils';
import { LOCATION_QUERY } from 'sagas/model';

export default function* earth() {
  yield takeLatest('HOME', toHome);
}

function* toHome() {
  yield put(setPlacesLoading(true));
  yield put(setPlaceSelectedOpen(false));
  const group = yield select(getGroup);

  try {
    const places = yield all({
      featured: call(fetchPlaces, {
        ...LOCATION_QUERY,
        ...{ filter: 'featured==true', group: group.join('|') },
      }),
    });
    // set
    yield put(setPlacesError(null));
    yield put(setPlacesLoading(false));
  } catch (e) {
    // err
    setPlacesLoading(false);
    setPlacesError(e);
  } finally {
    if (yield cancelled()) {
      console.error('Cancelled!!!!!!!');
    }
  }
}
