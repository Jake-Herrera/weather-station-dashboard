import type { CurveType } from "recharts";
import type { MetricKey } from "./metrics"

export type ChartData = {
    type?: CurveType;
    name: string;
    dot?: boolean;
    opacity?: number;
    strokeDasharray?: string;
}

export type YAxisData = {
    orientation: "right" | "left";
    domain: [string | number, string | number];
}

export type MetricChartMetaData = {
    id: string;
    key: MetricKey;
    color: string;
    type: "area" | "line" | "bar";
    chartData: ChartData;
    yAxisData: YAxisData;
}