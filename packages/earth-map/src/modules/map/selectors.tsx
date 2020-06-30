import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const latlng = state => state.map.latlng;

export const getPopup = createSelector([latlng], _latlng => {
  if (isEmpty(_latlng) || !_latlng.lat || !_latlng.lng) {
    return {};
  }

  const popup = {
    latitude: _latlng.lat,
    longitude: _latlng.lng,
  };

  return popup;
});

export default {
  getPopup,
};
