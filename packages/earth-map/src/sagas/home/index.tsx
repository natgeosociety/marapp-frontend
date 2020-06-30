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
        ...{ filter: 'featured==true', group: group.toString() },
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
