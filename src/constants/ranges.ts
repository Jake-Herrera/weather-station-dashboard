import type { TimeRange } from '@/types/reading';

export const RANGES: TimeRange[] = [
  '1h',
  '6h',
  '24h',
  '7d',
  '30d',
];

export const DEFAULT_RANGE: TimeRange = '24h';

export const RANGE_LABEL: Record<TimeRange, string> = {
  '1h':  '1 hora',
  '6h':  '6 horas',
  '24h': '24 horas',
  '7d':  '7 días',
  '30d': '30 días',
};

export const RANGE_TO_MS: Record<TimeRange, number> = {
  '1h':  1  * 60 * 60 * 1000,
  '6h':  6  * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d':  7  * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};