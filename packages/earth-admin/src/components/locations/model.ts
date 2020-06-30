export interface Location {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  type: LocationTypeEnum;
  geojson?: {};
  published?: boolean;
  featured?: boolean;
  bbox2d?: number[];
  areaKm2?: number;
  centroid?: {};
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  metrics?: LocationMetricsProps[] | string[];
  intersections?: LocationIntersection[] | string[];
}

export interface LocationContextProps {
  locations: Location[];
  handleSearchValueChange: (newValue: string) => void;
  handleCursorChange: Function;
  pagination: {
    pageCursor: string;
  };
  isLoading: boolean;
  isNoMore: boolean;
  searchValue?: string;
}

export enum LocationTypeEnum {
  CONTINENT = 'Continent',
  COUNTRY = 'Country',
  JURISDICTION = 'Jurisdiction',
  BIOME = 'Biome',
  PROTECTED_AREA = 'Protected Area',
  SPECIES_AREA = 'Species Area',
}

export interface MetricProps {
  id: any;
  slug?: string;
  metric?: object;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  location?: string | Location;
}

export interface LocationMetricsProps {
  data: MetricProps;
  handlers: {
    handleServerErrors: Function;
  };
}

export interface LocationProps {
  data?: Location;
  newLocation?: boolean;
}

export interface LocationIntersectionProps {
  intersections?: LocationIntersection[];
  name?: string;
}

export interface LocationIntersection {
  name?: string;
  id?: string;
  type?: 'country' | 'jurisdiction' | 'continent';
}

export const LOCATION_METRICS_VISUAL_MAPPING = {
  default: {
    icon: 'warning',
    color: '#FFD500',
  },
  'biodiversity-intactness': {
    icon: 'atlas',
    color: '#26A406',
  },
  'human-footprint': {
    icon: 'walker',
    color: 'rgb(230, 44, 144)',
  },
  'land-use': {
    icon: 'home',
    color: '#356122',
  },
  'terrestrial-carbon': {
    icon: 'compass',
    color: 'rgb(253, 158, 89)',
  },
  'human-impact': {
    icon: 'family',
    color: '#FFBC00',
  },
  'tree-loss': {
    icon: 'atlas-globe',
    color: 'rgb(253, 107, 133)',
  },
  'protected-areas': {
    icon: 'search',
    color: '#966DB3',
  },
  'modis-fire': {
    icon: 'idea',
    color: '#BA1001',
  },
  'modis-evi': {
    icon: 'idea',
    color: '#00BAAA',
  },
};
