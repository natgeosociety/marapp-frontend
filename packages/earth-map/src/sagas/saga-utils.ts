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

// Selectors
export const getGroup = (state) => state.user.group;
export const getPlaces = (state) => state.places;
export const getUser = (state) => state.user;
export const getMap = (state) => state.map;
