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

/**
 * https://redux-saga.js.org/docs/api/#takepattern
 * A pattern function passed to saga effects to ignore action routes that are just redirects. Eg: when a layer is toggled
 */
export const ignoreRedirectsTo = (actionName: string): Function => {
  return (action): boolean => {
    const actionWeCareAbout = action.type === actionName;
    if (!actionWeCareAbout) {
      return false;
    }
    // not an action fired by the router, just match it by name
    if (!action.meta) {
      console.warn(
        `${actionName} is not an action fired by the router. You can remove ignoreRedirectsTo() function`
      );
      return true;
    }
    return !(action.meta.location.kind === 'redirect');
  };
};

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

// Selectors
export const getAll = (state) => state;
export const getGroup = (state) => state.user.group;
export const getPlaces = (state) => state.places;
export const getLayers = (state) => state.layers;
export const getUser = (state) => state.user;
export const getMap = (state) => state.map;
