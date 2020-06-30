export interface FireMetric {
  start_date: string;
  end_date: string;
  year_isoweek: FireYear[];
}

interface FireYear {
  year: number;
  isoweek: number;
  value: number;
}
