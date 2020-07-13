export const LOCATION_QUERY = {
  select: '-geojson',
  page: { size: 300 },
  sort: 'name',
};

export const DATA_INDEX_QUERY = {
  page: { size: 10, number: 1 },
  include: 'layers,widgets,layers.references,widgets.layers',
};

export const LAYER_QUERY = {
  page: { size: 50 },
};

export const METRICS_QUERY = {};
