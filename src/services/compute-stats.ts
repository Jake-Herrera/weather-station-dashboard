import type { Reading } from '@/types/reading';

// Which numeric metric of a reading we want stats for.
export type MetricKey = 'temp_c' | 'pressure_hpa' | 'altitude_m';

export type MetricStats = {
  current: number; // most recent value
  max: number;
  min: number;
  avg: number;
  rangeDelta: number; // max - min
};

// Pure function: compute stats for one metric over a list of readings.
// Returns null when there are no readings (the UI decides what to show).
export function computeStats(
  readings: Reading[],
  metric: MetricKey,
): MetricStats | null {
  if (readings.length === 0) {
    return null;
  }

  // Assumes readings are sorted ascending by ts (our filter does that).
  const values = readings.map((reading) => reading[metric]);

  const max = Math.max(...values);
  const min = Math.min(...values);
  const sum = values.reduce((acc, value) => acc + value, 0);
  const avg = sum / values.length;
  const current = values[values.length - 1];

  return {
    current,
    max,
    min,
    avg,
    rangeDelta: max - min,
  };
}