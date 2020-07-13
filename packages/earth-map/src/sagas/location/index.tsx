import { select, takeLatest, delay, put, call, cancelled } from 'redux-saga/effects';
import groupBy from 'lodash/groupBy';
import { replace } from 'redux-first-router';

// Services
import { fetchPlace } from 'services/places';

// Actions
import { setMap } from 'modules/map/actions';
import { setMetrics, setMetricsLoading } from 'modules/metrics/actions';
import {
  setPlaceData,
  setPlaceSelectedOpen,
  setPlaceSelectedFilter,
  setPlaceSelectedSearch,
  setPlacesLoading,
  setPlacesError,
  setPlacesSearch,
  setPlacesSearchOpen,
} from 'modules/places/actions';
import { setLastViewedPlace, persistData } from 'modules/global/actions';

import { IPlace } from 'modules/places/model';
import { preloadLayers } from 'sagas/layers';
import { ignoreRedirectsTo } from 'sagas/saga-utils';

// TODO : EP-1817 refactoring
let PREV_SLUG = null;
const ignoreRedirectsToLocation = ignoreRedirectsTo('LOCATION');

export default function* location() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToLocation, preloadLayers);
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToLocation, toLocation);
}

function* toLocation({ payload, meta }) {
  const { organization, slug } = payload;

  if (!meta.query) {
    PREV_SLUG = null;
  }

  if (!slug || slug === PREV_SLUG) {
    return;
  }

  yield put(setPlacesSearchOpen(false));
  yield put(setPlacesLoading(true));
  yield put(setPlaceSelectedOpen(false));
  yield put(setMetricsLoading(true));

  try {
    const { data }: { data: IPlace } = yield call(fetchPlace, slug, {
      include: 'metrics',
      group: organization,
    });

    const mappedIntersections = groupBy(data.intersections, 'type');

    const formattedData = {
      ...data,
      ...{
        jurisdictions: mappedIntersections.Jurisdiction,
        biomes: mappedIntersections.Biome,
        countries: mappedIntersections.Country,
        continents: mappedIntersections.Continent,
      },
    };

    const { map } = yield select();

    yield put(
      setMap({
        ...map,
        bounds: {
          bbox: data.bbox2d,
          options: {
            padding: {
              top: 50,
              bottom: 50,
              left: 50,
              right: 50,
            },
          },
        },
      })
    );

    // Let animations finish before we change the place
    yield delay(750);

    yield put(setPlacesSearch({ search: data.name }));
    yield put(setPlaceSelectedFilter(''));
    yield put(setPlaceSelectedSearch(''));
    yield put(setPlaceData(formattedData));
    yield put(setLastViewedPlace({
      id: data.id,
      name: data.name,
      slug: data.slug,
      organization: data.organization,
      type: data.type,
    }));
    yield put(setMetrics(formattedData.metrics));
    yield put(setPlacesLoading(false));
    yield put(setPlacesError(null));
    yield put(setMetricsLoading(false));
    yield put(persistData()); // to keep last viewed place
  } catch (e) {
    // TODO better error handling for sagas
    if (e.response.status === 403) {
      replace('/404');
    }
  } finally {
    if (yield cancelled()) {
      console.error('Cancelled!!!!!!!');
    } else {
      PREV_SLUG = slug;
    }
  }
}