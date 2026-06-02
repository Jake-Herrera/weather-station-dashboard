import type { Reading } from '@/types/reading';

// A reading shaped for the chart: keeps the raw values + a human-readable time label.
export type ChartPoint = Omit<Reading, 'ts'> & { time: string };

// Pure function: turn readings into chart points with a formatted time label.
export function formatChartData(readings: Reading[]): ChartPoint[] {
  return readings.map((reading) => ({
    time: new Date(reading.ts).toLocaleString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    temp_c: reading.temp_c,
    pressure_hpa: reading.pressure_hpa,
    altitude_m: reading.altitude_m,
    humidity_pct: reading.humidity_pct
  }));
}