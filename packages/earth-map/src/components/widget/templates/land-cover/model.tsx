export interface LandCoverMetric {
  data_2015: {
    forest: number;
    shrubland: number;
    sparse_vegetation: number;
    grassland: number;
    wetland: number;
    water: number;
    permanent_snow_and_ice: number;
    bare: number;
    agriculture: number;
    settlements: number;
    no_data: number;
  };
  area_km2: number;
}
