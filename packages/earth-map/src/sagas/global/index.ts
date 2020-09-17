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

import { select, takeLatest } from 'redux-saga/effects';
import { getAll } from 'sagas/saga-utils';
import { IEphemeralState } from 'store/ephemeral-state';

export default function* global() {
  yield takeLatest('GLOBAL/persistData', persistData);
}

function* persistData() {
  const state = yield select(getAll);

  // keep full reducer state instead of a substate. eg `places` instead of `places.search`
  const keepThis: IEphemeralState = {
    places: {
      search: state.places.search.search,
      filters: state.places.search.filters,
    },
    layers: {
      search: state.layers.search.search,
      filters: state.layers.search.filters,
    },
    global: {
      lastViewedPlace: state.global.lastViewedPlace,
    },
    map: {
      mapStyle: state.map.mapStyle,
    },
    user: state.user,
  };

  sessionStorage.setItem('ephemeral', JSON.stringify(keepThis));
}
