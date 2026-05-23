export type Reading = {
  ts: number;
  temp_c: number;
  pressure_hpa: number;
  altitude_m: number;
};

export type TimeRange =
  | '1h'
  | '6h'
  | '24h'
  | '7d'
  | '30d';

export type DeviceMeta = {
  name: string;
  location: string;
  elevation_m?: number;
};