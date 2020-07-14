import { all, fork } from 'redux-saga/effects';

// Sagas
import home from 'sagas/home';
import earth from 'sagas/earth';
import global from 'sagas/global';
import places from 'sagas/places';
import indexes from 'sagas/indexes';
import location from 'sagas/location';

export default function* root() {
  yield all([
    fork(home),
    fork(earth),
    fork(global),
    fork(places),
    fork(indexes),
    fork(location)
  ]);
}
