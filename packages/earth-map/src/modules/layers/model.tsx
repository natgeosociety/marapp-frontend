export interface ILayer {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  type?: LayerType;
  provider?: LayerProvider;
  category: LayerCategory[];
  legendConfig: object;
  layerConfig: ILayerConfig;
  interactionConfig: any;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  references?: any;
  source?: any;
  paramsConfig?: any;
  sqlConfig?: any;
  decodeConfig?: any;
  timelineConfig?: any;
}

interface ILayerConfig {
  paramsConfig: any;
  sqlConfig: any;
  decodeConfig: any;
  timelineConfig: any;
  type: LayerType;
  layers: ILayer[];
  body: any;
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
