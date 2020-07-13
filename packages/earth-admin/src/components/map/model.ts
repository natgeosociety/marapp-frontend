import { APP_BASEMAPS } from '../../theme';

export const MAP_DEFAULT = {
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

export const LAYER_DEFAULT = {
  name: 'admin layer',
  id: 'admin-layer',
  slug: 'admin-layer',
  type: 'geojson',
  provider: 'mapbox',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[65.824585, 53.926986]],
          },
        },
      ],
    },
  },
  render: {
    layers: [
      {
        type: 'fill',
        paint: {
          'fill-color': '#000',
          'fill-opacity': 0.25,
        },
      },
      {
        type: 'line',
        paint: {
          'line-color': '#000',
          'line-width': 2,
        },
      },
    ]
  },
};
