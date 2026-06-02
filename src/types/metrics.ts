import type { Reading } from '@/types/reading';

export type MetricLabel = "TEMPERATURA" | "PRESIÓN" | "ALTITUD" | "HUMEDAD";

export type MetricKey = keyof Omit<Reading, 'ts'>;

export type MetricUnit = '°C' | 'hPa' | 'm' | '%';

type MetricConfig = {
  label: MetricLabel;
  unit: MetricUnit;
  decimals: number;
};

export const METRICS: Record<MetricKey, MetricConfig> = {
  temp_c:       { label: 'TEMPERATURA', unit: '°C',  decimals: 1 },
  pressure_hpa: { label: 'PRESIÓN',     unit: 'hPa', decimals: 1 },
  altitude_m:   { label: 'ALTITUD',     unit: 'm',   decimals: 0 },
  humidity_pct: { label: 'HUMEDAD',     unit: '%',   decimals: 0 },
};