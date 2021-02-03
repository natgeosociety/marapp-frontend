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

import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRoutes } from 'redux-first-router';
import thunk from 'redux-thunk';
import { handleModule } from 'vizzuality-redux-tools';

import { SessionStorage } from '@marapp/earth-shared';

import * as global from '../modules/global';
import * as indexes from '../modules/indexes';
import * as layers from '../modules/layers';
import * as map from '../modules/map';
import * as metrics from '../modules/metrics';
import * as places from '../modules/places';
import * as sidebar from '../modules/sidebar';
import * as user from '../modules/user';
import * as widget from '../modules/widget';
import * as widgets from '../modules/widgets';
import { CONFIG, ROUTES } from '../routes';
import initEphemeralState from '../store/ephemeral-state';

const initStore = (initialState = {}) => {
  // Create router reducer, middleware and enhancer
  const {
    reducer: routerReducer,
    middleware: routerMiddleware,
    enhancer: routerEnhancer,
    initialDispatch,
  } = connectRoutes(ROUTES, CONFIG);

  const reducers = combineReducers({
    router: routerReducer,
    global: handleModule(global),
    user: handleModule(user),
    map: handleModule(map),
    sidebar: handleModule(sidebar),
    indexes: handleModule(indexes),
    places: handleModule(places),
    layers: handleModule(layers),
    widgets: handleModule(widgets),
    widget: handleModule(widget),
    metrics: handleModule(metrics),
  });

  const rootReducer = (state, action) => {
    if (action.type === 'GLOBAL/resetStore') {
      state = {
        ...initialState,
        global: {
          // @ts-ignore
          ...initialState.global,
          ...(state.global.lastViewedPlace && { lastViewedPlace: state.global.lastViewedPlace }),
        },
      };
    }
    return reducers(state, action);
  };

  const composeEnhancer = composeWithDevTools({
    trace: true,
    traceLimit: 10,
  });

  const middlewares = applyMiddleware(thunk, routerMiddleware);
  const enhancers = composeEnhancer(routerEnhancer, middlewares);

  // create store
  // @ts-ignore
  const store: Store = createStore(rootReducer, initialState, enhancers);

  // restore state from sessionStorage
  const ephemeralState = SessionStorage.getObject('ephemeral');
  initEphemeralState(store, ephemeralState);

  initialDispatch();

  return { store };
};

export default initStore;
