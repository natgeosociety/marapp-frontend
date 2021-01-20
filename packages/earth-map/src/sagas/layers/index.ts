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

import sortBy from 'lodash/sortBy';
import { replace } from 'redux-first-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { serializeFilters } from '@marapp/earth-shared';

import { persistData } from '../../modules/global/actions';
import { setIndexesList } from '../../modules/indexes/actions';
import { IIndex } from '../../modules/indexes/model';
import {
  nextLayersPage,
  resetLayersResults,
  setLayersActive,
  setLayersLoading,
  setLayersSearch,
  setLayersSearchAvailableFilters,
  setLayersSearchResults,
  setListActiveLayers,
} from '../../modules/layers/actions';
import { ILayer } from '../../modules/layers/model';
import { setSidebarPanel } from '../../modules/sidebar/actions';
import { EPanels } from '../../modules/sidebar/model';
import { IWidget } from '../../modules/widget/model';
import { setWidgets, setWidgetsError, setWidgetsLoading } from '../../modules/widgets/actions';
import DashboardsService from '../../services/DashboardsService';
import LayersService from '../../services/LayersService';
import { DATA_INDEX_QUERY, LAYER_QUERY } from '../model';
import { flattenLayerConfig, getGroup, getLayers, onlyMatch } from '../saga-utils';

export default function* layers() {
  // @ts-ignore
  yield takeLatest(onlyMatch(setSidebarPanel, EPanels.LAYERS), searchLayers);
  yield takeLatest(setLayersSearch, searchLayers);
  yield takeLatest(nextLayersPage, nextPage);

  // Queries the api and loads the active layers objects. Does nothing to display the layer on the map. That is handled in the <Url /> component that reacts to query param changes
  yield takeLatest(setLayersActive, loadActiveLayers);
}

/**
 * Load active layer objects on refresh
 */
function* loadActiveLayers({ payload }) {
  if (!payload.length) {
    return;
  }
  const group = yield select(getGroup);
  const options = {
    ...LAYER_QUERY,
    filter: serializeFilters({
      slug: payload,
    }),
    group: group.join(','),
  };
  const { data: layers } = yield call(LayersService.fetchLayers, options);
  const decoratedLayers: ILayer[] = layers.map(flattenLayerConfig);

  yield put(setListActiveLayers(decoratedLayers));

  // to activate a selected layer on reload, it needs to be in layers.results
  yield put(
    setLayersSearchResults({
      results: layers,
    })
  );
}

function* searchLayers(params) {
  yield put(resetLayersResults());
  const { meta } = yield nextPage(params);
  yield put(setLayersSearchAvailableFilters(meta.filters));
  yield put(persistData());
}

/**
 * Used to retrieve a page of results
 */
export function* nextPage({ payload }) {
  const group = yield select(getGroup);
  const { search } = yield select(getLayers);
  const { filters, search: userInput } = search;
  const { pageCursor, pageSize } = payload;

  const filterQuery = serializeFilters({
    ...filters,
    primary: true,
  });

  yield put(setLayersLoading(true));
  const options = {
    ...LAYER_QUERY,
    ...(!!userInput && { search: userInput }),
    ...(!!filterQuery && { filter: filterQuery }),
    'page[cursor]': pageCursor ? pageCursor : -1,
    ...(pageSize && { page: { size: pageSize } }),
    group: group.toString(),
  };
  const page = yield call(LayersService.fetchLayers, options);
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
    const indexes: IIndex[] = yield call(DashboardsService.fetchDashboards, {
      ...DATA_INDEX_QUERY,
      ...{ group: group.toString() },
    });

    const widgets = indexes.reduce((acc, index) => {
      return [...acc, ...(index?.widgets || [])];
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
  const decoratedLayers: ILayer[] = widget.layers.map(flattenLayerConfig);

  const adaptedWidget = { ...widget, ...widget.config, ...{ layers: decoratedLayers } };

  return adaptedWidget;
}
