export enum LayerType {
  raster = 'raster',
  vector = 'vector',
  geojson = 'geojson',
  group = 'group',
  video = 'video',
}

export enum LayerProvider {
  cartodb = 'cartodb',
  gee = 'gee',
  mapbox = 'mapbox',
  leaflet = 'leaflet',
}

export interface Layer {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  type?: LayerType;
  provider?: LayerProvider;
  category: LayerCategory[];
  config: object;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  references?: Layer[];
}

export interface LayerProps {
  data: Layer;
  newLayer?: boolean;
}

export enum LayerCategory {
  BIODIVERSITY = 'Biodiversity',
  CLIMATE_CARBON = 'Climate & Carbon',
  ECOSYSTEM_SERVICES = 'Ecosystem Services',
  HUMAN_IMPACT = 'Human Impact',
  LAND_COVER = 'Land Cover',
  MARINE = 'Marine',
  NATURAL_HAZARDS = 'Natural Hazards',
  PROTECTED_AREAS = 'Protected Areas',
  RESTORATION = 'Restoration',
  SOCIO_ECONOMIC = 'Socio-Economic',
}
