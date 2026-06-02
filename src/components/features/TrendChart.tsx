import { Fragment } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatChartData } from '@/services/format-chart-data';
import type { Reading } from '@/types/reading';
import type { MetricChartMetaData } from '@/types/metricChart';

type Props = {
  readings: Reading[];
  metadata: MetricChartMetaData[];
  range: string;
};

export function TrendChart({ readings, metadata, range }: Props) {
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
      <p className="mb-1 text-xs tracking-widest text-gray-400">
        TENDENCIA · {range}
      </p>
      <p className="mb-4 text-[17px] tracking-widest text-white font-normal">
        SERIES ATMOSFÉRICAS
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={data}>
          {/* Gradient definition for the temperature area fill */}


          <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" />

          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#16171d',
              border: '1px solid #2e303a',
              borderRadius: '8px',
            }}
          />

          <Legend />

          {metadata.map((data) =>{
            switch(data.type) {
              case "area":
                return (
                  <Fragment key={data.id}>
                    <YAxis
                      yAxisId={data.id}
                      stroke={data.color}
                      fontSize={12}
                      {...data.yAxisData}
                    />
                    <defs>
                      <linearGradient id={`${data.id}Gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={data.color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={data.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      yAxisId={data.id}
                      dataKey={data.key}
                      stroke={data.color}
                      strokeWidth={2}
                      fill={`url(#${data.id}Gradient)`}
                      {...data.chartData}
                    />
                  </Fragment>
                );
              case "line":
                return (
                  <Fragment key={data.id}>
                    <YAxis
                      yAxisId={data.id}
                      stroke={data.color}
                      fontSize={12}
                      {...data.yAxisData}
                    />
                    <Line
                      yAxisId={data.id}
                      dataKey={data.key}
                      stroke={data.color}
                      {...data.chartData}
                    />
                  </Fragment>
                );
              case "bar":
                return (
                  <Fragment key={data.id}>
                    <YAxis
                      yAxisId={data.id}
                      stroke={data.color}
                      fontSize={12}
                      {...data.yAxisData}
                    />
                    <Bar
                      yAxisId={data.id}
                      dataKey={data.key}
                      fill={data.color}
                      {...data.chartData}
                    />
                  </Fragment>
                );
              default:
                return null;
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}