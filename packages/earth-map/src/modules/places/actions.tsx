import { createAction } from 'vizzuality-redux-tools';

/* Places actions */
export const setPlace = createAction('PLACES/setPlace');

export const setPlacesCache = createAction('PLACES/setPlacesCache');

// Featured
export const resetPlacesFeatured = createAction('PLACES/resetPlacesFeatured');

// Selected
export const setPlaceData = createAction('PLACES/setPlaceData');
export const setPlacesLoading = createAction('PLACES/setPlacesLoading');
export const setPlacesError = createAction('PLACES/setPlacesError');
export const setPlaceSelectedOpen = createAction('PLACES/setPlaceSelectedOpen');
export const setPlaceSelectedSearch = createAction('PLACES/setPlaceSelectedSearch');
export const setPlaceSelectedFilter = createAction('PLACES/setPlaceSelectedFilter');
export const setPlaceSelectedId = createAction('PLACES/setPlaceSelectedId');

// Search
export const setPlacesSearch = createAction('PLACES/setPlacesSearch');
export const setPlacesSearchLoading = createAction('PLACES/setPlacesSearchLoading');
export const setPlacesSearchFilters = createAction('PLACES/setPlacesSearchFilters');
export const setPlacesSearchAvailableFilters = createAction('PLACES/setPlacesSearchAvailableFilters');
export const setPlacesSearchOpen = createAction('PLACES/setPlacesSearchOpen');
export const setPlacesSearchResults = createAction('PLACES/setPlacesSearchResults');
export const nextPlacesPage = createAction('PLACES/nextPlacesPage');

export const resetPlacesResults = createAction('PLACES/resetPlacesResults');
export const resetPlace = createAction('PLACES/resetPlace');
