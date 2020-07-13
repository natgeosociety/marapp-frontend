export interface IPlace {
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
  organization?: string;
  metrics?: LocationMetricsProps[] | string[];
  intersections?: LocationIntersection[] | string[];
  $searchHint?: {
    [prop: string]: string
  };
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

export interface LocationIntersection {
  name?: string;
  id?: string;
  type?: 'country' | 'jurisdiction' | 'continent';
}

export interface IFilter {
  key: string;
  value: string;
  count: number;
}