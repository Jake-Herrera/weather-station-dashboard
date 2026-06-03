import { describe, it, expect } from 'vitest';
import { filterReadingsByRange } from '@/services/filter-readings';
import type { Reading } from '@/types/reading';

function makeReading(ts: number): Reading {
  return { ts, temp_c: 20, pressure_hpa: 1013, altitude_m: 100, humidity_pct: 50 };
}

// Fixed "now" so tests don't depend on wall-clock time.
const NOW = 1_700_000_000_000;
// 1h in ms
const ONE_HOUR_MS = 60 * 60 * 1000;

describe('filterReadingsByRange', () => {
  it('returns empty array when given an empty array', () => {
    expect(filterReadingsByRange([], '1h', NOW)).toEqual([]);
  });

  it('reading exactly at the start boundary is included', () => {
    const startTs = NOW - ONE_HOUR_MS;
    const reading = makeReading(startTs);

    const result = filterReadingsByRange([reading], '1h', NOW);

    expect(result).toHaveLength(1);
  });

  it('reading one millisecond before the start boundary is excluded', () => {
    const justBefore = NOW - ONE_HOUR_MS - 1;
    const reading = makeReading(justBefore);

    const result = filterReadingsByRange([reading], '1h', NOW);

    expect(result).toHaveLength(0);
  });

  it('returns empty array when no readings fall within the range', () => {
    const ancient = makeReading(NOW - ONE_HOUR_MS * 10);

    const result = filterReadingsByRange([ancient], '1h', NOW);

    expect(result).toEqual([]);
  });

  it('sorts results ascending by timestamp regardless of input order', () => {
    const t1 = NOW - 30 * 60 * 1000;
    const t2 = NOW - 20 * 60 * 1000;
    const t3 = NOW - 10 * 60 * 1000;
    const readings = [makeReading(t3), makeReading(t1), makeReading(t2)];

    const result = filterReadingsByRange(readings, '1h', NOW);

    expect(result.map((r) => r.ts)).toEqual([t1, t2, t3]);
  });

  it('includes only readings within the selected range', () => {
    const inside = makeReading(NOW - 30 * 60 * 1000);
    const outside = makeReading(NOW - ONE_HOUR_MS * 2);

    const result = filterReadingsByRange([inside, outside], '1h', NOW);

    expect(result).toHaveLength(1);
    expect(result[0].ts).toBe(inside.ts);
  });
});
