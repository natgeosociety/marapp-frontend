import { select, takeLatest } from 'redux-saga/effects';

import { getPlaces, getUser, getMap } from 'sagas/saga-utils';

export default function* global() {
  yield takeLatest('GLOBAL/persistData', persistData);
}

function* persistData() {
  const places = yield select(getPlaces);
  const user = yield select(getUser);
  const map = yield select(getMap);

  // keep full reducer state instead of a substate. eg `places` instead of `places.search`
  const keepThis = {
    sidebarState: {
      search: places.search.search,
      filters: places.search.filters,
    },
    map: {
      mapStyle: map.mapStyle,
    },
    user,
  };

  sessionStorage.setItem('ephemeral', JSON.stringify(keepThis));
}
