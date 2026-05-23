import type { TimeRange } from '@/types/reading';

export const RANGES: TimeRange[] = [
  '1h',
  '6h',
  '24h',
  '7d',
  '30d',
];

export const DEFAULT_RANGE: TimeRange =
  '24h';