import { all, takeLatest } from 'redux-saga/effects';

export default function* places() {
  yield all([
    // @ts-ignore
    takeLatest('INDEXES/setIndexesSelected', toIndexesSelected),
    // @ts-ignore
    takeLatest('PLACES/setPlaceData', toIndexesSelected),
  ]);
}

/**
 * Fetch the widgets that belongs to the index selected
 */
function* toIndexesSelected({ payload }) {}
