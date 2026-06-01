import { describe, it, expect } from 'vitest';
import { computeStats } from '@/services/compute-stats';
import type { Reading } from '@/types/reading';

// Helper to build readings quickly
function makeReadings(temps: number[]): Reading[] {
  return temps.map((temp, i) => ({
    ts: 1_700_000_000_000 + i * 1000,
    temp_c: temp,
    pressure_hpa: 1013,
    altitude_m: 100,
    humidity_pct: 50,
  }));
}

describe('computeStats', () => {
  it('returns null for an empty array', () => {
    expect(computeStats([], 'temp_c')).toBeNull();
  });

  it('computes max, min, avg and rangeDelta for temperature', () => {
    const readings = makeReadings([20, 22, 24]);

    const stats = computeStats(readings, 'temp_c');

    expect(stats).not.toBeNull();
    expect(stats!.max).toBe(24);
    expect(stats!.min).toBe(20);
    expect(stats!.avg).toBe(22);
    expect(stats!.rangeDelta).toBe(4);
  });

  it('uses the last reading as the current value', () => {
    const readings = makeReadings([20, 22, 24]);

    const stats = computeStats(readings, 'temp_c');

    expect(stats!.current).toBe(24);
  });

  it('handles a single reading', () => {
    const readings = makeReadings([21.5]);

    const stats = computeStats(readings, 'temp_c');

    expect(stats!.max).toBe(21.5);
    expect(stats!.min).toBe(21.5);
    expect(stats!.avg).toBe(21.5);
    expect(stats!.rangeDelta).toBe(0);
  });

  it('computes stats for humidity_pct', () => {
    const readings = makeReadings([0, 0, 0]).map((r, i) => ({
      ...r,
      humidity_pct: [40, 60, 80][i],
    }));

    const stats = computeStats(readings, 'humidity_pct');

    expect(stats!.max).toBe(80);
    expect(stats!.min).toBe(40);
    expect(stats!.avg).toBe(60);
    expect(stats!.current).toBe(80);
    expect(stats!.rangeDelta).toBe(40);
  });
});