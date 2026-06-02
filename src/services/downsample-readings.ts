import type { Reading, TimeRange } from '@/types/reading';

const BUCKET_MS: Record<TimeRange, number> = {
  '1h':  0,
  '6h':  0,
  '24h': 30 * 60 * 1000,
  '7d':  2  * 60 * 60 * 1000,
  '30d': 6  * 60 * 60 * 1000,
};

function avg(group: Reading[], key: keyof Omit<Reading, 'ts'>): number {
  return Number((group.reduce((sum, r) => sum + r[key], 0) / group.length).toFixed(2));
}

export function downsampleReadings(readings: Reading[], range: TimeRange): Reading[] {
  const bucketMs = BUCKET_MS[range];
  if (!bucketMs) return readings;

  const buckets = new Map<number, Reading[]>();

  for (const reading of readings) {
    const key = Math.floor(reading.ts / bucketMs) * bucketMs;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(reading);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([bucketTs, group]) => ({
      ts:           bucketTs + bucketMs / 2,
      temp_c:       avg(group, 'temp_c'),
      pressure_hpa: avg(group, 'pressure_hpa'),
      altitude_m:   avg(group, 'altitude_m'),
      humidity_pct: avg(group, 'humidity_pct'),
    }));
}
