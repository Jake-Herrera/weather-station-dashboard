import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatChartData } from '@/services/format-chart-data';
import type { Reading } from '@/types/reading';

type Props = {
  readings: Reading[];
};

export function TrendChart({ readings }: Props) {
  const data = formatChartData(readings);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-transparent p-5">
        <p className="text-gray-500">No data to chart yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-transparent p-5">
      <p className="mb-4 text-xs tracking-widest text-gray-400">
        TENDENCIA · SERIES ATMOSFÉRICAS
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          {/* Gradient definition for the temperature area fill */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />

          {/* Left axis: temperature */}
          <YAxis
            yAxisId="temp"
            stroke="#f59e0b"
            fontSize={12}
            domain={['auto', 'auto']}
          />
          {/* Right axis: pressure */}
          <YAxis
            yAxisId="pressure"
            orientation="right"
            stroke="#38bdf8"
            fontSize={12}
            domain={['auto', 'auto']}
          />
          {/* Hidden axis: altitude */}
          <YAxis yAxisId="altitude" hide domain={['auto', 'auto']} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#16171d',
              border: '1px solid #2e303a',
              borderRadius: '8px',
            }}
          />
          <Legend />

          {/* Temperature: solid line + translucent area fill */}
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="temp_c"
            name="Temperatura"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#tempGradient)"
            dot={false}
          />

          {/* Pressure: solid line */}
          <Line
            yAxisId="pressure"
            type="monotone"
            dataKey="pressure_hpa"
            name="Presión"
            stroke="#38bdf8"
            dot={false}
            strokeWidth={2}
          />

          {/* Altitude: dashed line */}
          <Line
            yAxisId="altitude"
            type="monotone"
            dataKey="altitude_m"
            name="Altitud"
            stroke="#a78bfa"
            strokeDasharray="3 3"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}