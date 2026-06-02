import type { Reading, TimeRange } from '@/types/reading';
import { RANGE_TO_MS } from '@/constants/ranges';

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