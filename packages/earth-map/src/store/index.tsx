import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import { connectRoutes } from 'redux-first-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import sagas from 'sagas';

import { ROUTES, CONFIG } from '../routes';
import restoreState from 'store/ephemeral-state';

// New modules
import { handleModule } from 'vizzuality-redux-tools';

// Modules
import * as global from 'modules/global';
import * as user from 'modules/user';
import * as map from 'modules/map';
import * as sidebar from 'modules/sidebar';
import * as indexes from 'modules/indexes';
import * as places from 'modules/places';
import * as layers from 'modules/layers';
import * as fullscreen from 'modules/fullscreen';
import * as widgets from 'modules/widgets';
import * as widget from 'modules/widget';
import * as metrics from 'modules/metrics';

const sagaMiddleware = createSagaMiddleware();

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
    fullscreen: handleModule(fullscreen),
    widgets: handleModule(widgets),
    widget: handleModule(widget),
    metrics: handleModule(metrics),
  });

  const rootReducer = (state, action) => {
    if (action.type === 'GLOBAL/resetStore') {
      state = initialState;
    }
    return reducers(state, action);
  }

  const middlewares = applyMiddleware(thunk, routerMiddleware, sagaMiddleware);
  const enhancers = composeWithDevTools(routerEnhancer, middlewares);

  // create store
  const store: Store = createStore(rootReducer, initialState, enhancers);

  // restore state from sessionStorage
  const ephemeralState = JSON.parse(sessionStorage.getItem('ephemeral'));
  restoreState(store, ephemeralState);

  // run the sagas && initialDispatch
  sagaMiddleware.run(sagas);
  initialDispatch();

  return { store };
};

export default initStore;
