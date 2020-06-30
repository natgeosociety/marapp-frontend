import { APP_BASEMAPS } from '../../theme';

export default {
  viewport: {
    zoom: 2,
    minZoom: 2,
    latitude: 20,
    longitude: 0,
  },
  bounds: {},
  interactions: {},
  hoverInteractions: {},
  latlng: {},
  mapStyle: APP_BASEMAPS[0].id,
  mapLabels: false,
  mapRoads: false,
};
