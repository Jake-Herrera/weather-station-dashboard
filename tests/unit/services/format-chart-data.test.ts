import { describe, it, expect } from 'vitest';
import { formatChartData } from '@/services/format-chart-data';
import type { Reading } from '@/types/reading';

function makeReading(ts: number, overrides: Partial<Reading> = {}): Reading {
  return {
    ts,
    temp_c: 22.5,
    pressure_hpa: 1013.2,
    altitude_m: 1150,
    humidity_pct: 65,
    ...overrides,
  };
}

describe('formatChartData', () => {
  it('returns empty array for empty input', () => {
    expect(formatChartData([])).toEqual([]);
  });

  it('output array has the same length as the input array', () => {
    const readings = [
      makeReading(1_700_000_000_000),
      makeReading(1_700_000_001_000),
      makeReading(1_700_000_002_000),
    ];

    expect(formatChartData(readings)).toHaveLength(3);
  });

  it('produces unique time keys for readings at the same time of day on different days', () => {
    // Same HH:mm (14:00) but one day apart — a time-only label would collide.
    const day1 = new Date(2024, 0, 1, 14, 0, 0).getTime();
    const day2 = new Date(2024, 0, 2, 14, 0, 0).getTime();
    const readings = [makeReading(day1), makeReading(day2)];

    const result = formatChartData(readings);

    expect(result[0].time).not.toBe(result[1].time);
  });

  it('numeric metric fields are passed through unchanged', () => {
    const reading = makeReading(1_700_000_000_000, {
      temp_c: 18.7,
      pressure_hpa: 1008.3,
      altitude_m: 875,
      humidity_pct: 42,
    });

    const [point] = formatChartData([reading]);

    expect(point.temp_c).toBe(18.7);
    expect(point.pressure_hpa).toBe(1008.3);
    expect(point.altitude_m).toBe(875);
    expect(point.humidity_pct).toBe(42);
  });

  it('time label contains both date and time components, not just the time of day', () => {
    // A label with only HH:mm would be ≤5 chars — a full date+time label is longer.
    const reading = makeReading(new Date(2024, 5, 15, 9, 30).getTime());

    const [point] = formatChartData([reading]);

    // "HH:mm" alone would be "09:30" (5 chars). A date+time string is longer.
    expect(point.time.length).toBeGreaterThan(5);
    // And it must contain a colon (time component) as well as a slash (date component).
    expect(point.time).toMatch(/:/);
    expect(point.time).toMatch(/\//);
  });
});
