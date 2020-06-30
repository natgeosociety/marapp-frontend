export interface EviMetric {
  mean: number;
  mean_norm: number;
  area_km2: number;
  std_p1: number;
  std_m1: number;
  std_p2: number;
  std_m2: number;
  rg_slope: number;
  rg_start: number;
  rg_end: number;
  year_data: EviYear[];
}

interface EviYear {
  year: number;
  value: number;
  norm: number;
  rescale: number;
}
