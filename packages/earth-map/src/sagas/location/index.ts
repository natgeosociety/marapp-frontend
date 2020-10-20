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

import groupBy from 'lodash/groupBy';
import { persistData, setLastViewedPlace } from 'modules/global/actions';
import { setMap } from 'modules/map/actions';
import { setMetrics, setMetricsLoading } from 'modules/metrics/actions';
import {
  setPlaceData,
  setPlaceSelectedFilter,
  setPlaceSelectedOpen,
  setPlaceSelectedSearch,
  setPlacesError,
  setPlacesLoading,
  setPlacesSearch,
} from 'modules/places/actions';
import { IPlace } from 'modules/places/model';
import { setSidebarPanelExpanded } from 'modules/sidebar/actions';
import { replace } from 'redux-first-router';
import { call, cancelled, delay, put, select, takeLatest } from 'redux-saga/effects';
import { loadDataIndexes } from 'sagas/layers';
import { ignoreRedirectsTo } from 'sagas/saga-utils';
import PlacesService from 'services/PlacesService';

let PREV_SLUG = null;
const ignoreRedirectsToLocation = ignoreRedirectsTo('LOCATION');

export default function* location() {
  // @ts-ignore
  yield takeLatest(ignoreRedirectsToLocation, loadDataIndexes);
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

  yield put(setSidebarPanelExpanded(false));
  yield put(setPlacesLoading(true));
  yield put(setPlaceSelectedOpen(false));
  yield put(setMetricsLoading(true));

  try {
    const { data }: { data: IPlace } = yield call(PlacesService.fetchPlaceById, slug, {
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
    yield put(
      setLastViewedPlace({
        id: data.id,
        name: data.name,
        slug: data.slug,
        organization: data.organization,
        type: data.type,
      })
    );
    yield put(setMetrics(formattedData.metrics));
    yield put(setPlacesLoading(false));
    yield put(setPlacesError(null));
    yield put(setMetricsLoading(false));
    yield put(persistData()); // to keep last viewed place
  } catch (e) {
    // TODO better error handling for sagas
    if (e.response.status === 403 || e.response.status === 404) {
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
