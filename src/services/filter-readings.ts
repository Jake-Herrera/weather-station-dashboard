import type { Reading, TimeRange } from '@/types/reading';

// Milliseconds covered by each range.
const RANGE_TO_MS: Record<TimeRange, number> = {
  '1h': 1 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

// Pure function: keep only readings within the range, sorted by time ascending.
// `now` is a parameter (default Date.now()) so tests can pass a fixed value.
export function filterReadingsByRange(
  readings: Reading[],
  range: TimeRange,
  now: number = Date.now(),
): Reading[] {
  const startTs = now - RANGE_TO_MS[range];

  return readings
    .filter((reading) => reading.ts >= startTs)
    .sort((a, b) => a.ts - b.ts);
}