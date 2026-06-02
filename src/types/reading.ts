export type Reading = {
  ts: number;
  temp_c: number;
  pressure_hpa: number;
  altitude_m: number;
  humidity_pct: number;
};

export type TimeRange =
  | '1h'
  | '6h'
  | '24h'
  | '7d'
  | '30d';