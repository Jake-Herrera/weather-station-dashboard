import type { Reading } from '@/types/reading';

// A reading shaped for the chart: keeps the raw values + a human-readable time label.
export type ChartPoint = {
  time: string;        // formatted label for the X axis (e.g. "20:34")
  temp_c: number;
  pressure_hpa: number;
  altitude_m: number;
};

// Pure function: turn readings into chart points with a formatted time label.
export function formatChartData(readings: Reading[]): ChartPoint[] {
  return readings.map((reading) => ({
    time: new Date(reading.ts).toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temp_c: reading.temp_c,
    pressure_hpa: reading.pressure_hpa,
    altitude_m: reading.altitude_m,
  }));
}