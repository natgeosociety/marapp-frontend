import { select, takeLatest } from 'redux-saga/effects';

import { getAll } from 'sagas/saga-utils';

export default function* global() {
  yield takeLatest('GLOBAL/persistData', persistData);
}

function* persistData() {
  const state = yield select(getAll);

  // keep full reducer state instead of a substate. eg `places` instead of `places.search`
  const keepThis = {
    sidebarState: {
      search: state.places.search.search,
      filters: state.places.search.filters,
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
