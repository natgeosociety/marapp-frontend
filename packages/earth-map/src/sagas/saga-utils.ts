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

import { ILayer, ILayerRaw } from 'modules/layers/model';

/**
 * https://redux-saga.js.org/docs/api/#takepattern
 * A pattern function passed to saga effects to ignore action routes that are just redirects. Eg: when a layer is toggled
 * returning true means the action will propagate, false means the action is blocked
 */
export const ignoreRedirectsTo = (actionName: string): Function => {
  return (action): boolean => {
    const actionWeCareAbout = action.type === actionName;
    if (!actionWeCareAbout) {
      return false;
    }

    const { current, prev } = action.meta.location;
    if (!prev.type) {
      return true;
    }
    const isSameResource =
      `${current.payload.organization}/${current.payload.slug}` ===
      `${prev.payload.organization}/${prev.payload.slug}`;
    if (isSameResource) {
      return false;
    }
    return true;
  };
};

/**
 * https://redux-saga.js.org/docs/api/#takepattern
 * A pattern function that matches a redux action and it's payload
 */
export const onlyMatch = (actionToMatch: string | Function, payload: any): Function => {
  return (action): boolean => {
    const actionName =
      typeof actionToMatch === 'function' ? actionToMatch.toString() : actionToMatch;
    const actionWeCareAbout = action.type === actionName;
    if (!actionWeCareAbout) {
      return false;
    }
    return action.payload === payload;
  };
};

/**
 * Put layer.config props directly on the layer - include layer reference
 */
export const flattenLayerConfig = (layer: ILayerRaw) => {
  const adaptedLayer = flattenEachLayerConfig(layer);

  if (!!adaptedLayer?.references?.length) {
    const adaptedReferences = layer.references.map(flattenEachLayerConfig);

    return {
      ...adaptedLayer,
      references: adaptedReferences,
    };
  }

  return {
    ...adaptedLayer,
  };
};

/**
 * Put layer.config props directly on the layer
 */
const flattenEachLayerConfig = (layer: ILayerRaw): ILayer => {
  const { config, ...rest } = layer;
  return {
    ...rest,
    ...config,
  };
};

// Selectors
export const getAll = (state) => state;
export const getGroup = (state) => state.user.group;
export const getPlaces = (state) => state.places;
export const getLayers = (state) => state.layers;
export const getUser = (state) => state.user;
export const getMap = (state) => state.map;
