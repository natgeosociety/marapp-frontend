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

import { all, put, call, select, takeLatest } from 'redux-saga/effects';
import { replace } from 'redux-first-router';
import sortBy from 'lodash/sortBy';
import { serializeFilters } from '@marapp/earth-components';

import { fetchDataIndexes } from 'services/data-indexes';
import { DATA_INDEX_QUERY } from '../model';
import { IIndex } from 'modules/indexes/model';
import { IWidget } from 'modules/widget/model';
import { setSidebarPanel } from 'modules/sidebar/actions';
import { EPanels } from 'modules/sidebar/model';
import { setWidgets, setWidgetsLoading, setWidgetsError } from 'modules/widgets/actions';
import { setIndexesList } from 'modules/indexes/actions';
import {
  setLayersList,
  setLayersSearch,
  setLayersLoading,
  setLayersSearchResults,
  setLayersSearchAvailableFilters,
  resetLayersResults,
  nextLayersPage,
} from 'modules/layers/actions';
import { getGroup, getLayers, onlyMatch, flattenLayerConfig } from 'sagas/saga-utils';
import { fetchLayers } from 'services/layers';
import { LAYER_QUERY } from '../model';

export default function* layers() {
  // @ts-ignore
  yield takeLatest(onlyMatch(setSidebarPanel, EPanels.LAYERS), searchLayers);
  yield takeLatest(setLayersSearch, searchLayers);
  yield takeLatest(nextLayersPage, nextPage)
}

function* searchLayers(params) {
  yield put(resetLayersResults());
  const { meta } = yield nextPage(params);
  yield put(setLayersSearchAvailableFilters(meta.filters));
}

/**
 * Used to retrieve a page of results
 */
export function* nextPage({ payload }) {
  const group = yield select(getGroup);
  const { search } = yield select(getLayers);
  const { filters, search: userInput } = search;
  const { pageCursor, pageSize } = payload;

  const filterQuery = serializeFilters(filters);

  yield put(setLayersLoading(true));
  const options = {
    ...LAYER_QUERY,
    ...(!!userInput && { search: userInput }),
    ...(!!filterQuery && { filter: filterQuery }),
    'page[cursor]': pageCursor ? pageCursor : -1,
    ...(pageSize && { page: { size: pageSize } }),
    ...{ group: group.toString() },
  };
  const page = yield call(fetchLayers, options);
  const { data: results, meta } = page;

  yield put(
    setLayersSearchResults({
      results,
      nextPageCursor: meta.pagination.nextCursor,
    })
  );
  yield put(setLayersLoading(false));

  return page;
}

export function* loadDataIndexes({ payload }) {
  const group = yield select(getGroup);

  try {
    const indexes: IIndex[] = yield call(fetchDataIndexes, {
      ...DATA_INDEX_QUERY,
      ...{ group: group.toString() },
    });
    const widgets = indexes.reduce((acc, index) => {
      return [...acc, ...index.widgets];
    }, []);
    const adaptedWidgets = widgets.map(setWidget);
    yield put(setWidgets(adaptedWidgets));
    yield put(
      setIndexesList(
        sortBy(indexes, (dil) => {
          const { name } = dil;
          return name;
        })
      )
    );

    // get layers from all dashboards; cannot use the layer api because that contains sublayers too
    // TODO - find out why removing the layers code below breaks layer toggle
    let layers = [];
    indexes.forEach((index) => {
      layers = [...layers, ...index.layers];
    });

    if (!!layers) {
      yield put(setLayersList(layers.map(flattenLayerConfig)));
    }
  } catch (e) {
    // TODO better error handling for sagas
    if (e.response.status === 403) {
      replace('/404');
    } else {
      yield put(setWidgets([]));
      yield put(setWidgetsLoading(false));
      yield put(setWidgetsError(e));
    }
  }
}

function setWidget(widget: IWidget) {
  const adaptedWidget = { ...widget, ...widget.config };
  delete adaptedWidget.config;

  return adaptedWidget;
}