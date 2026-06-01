import type { MetricChartMetaData } from "@/types/metricChart";

export const chartTemperatureAndHumidity: MetricChartMetaData[] = [
    {
        id: "temp",
        key: "temp_c",
        color: "#f59e0b",
        type: "area",
        chartData: {
            type: "monotone",
            name: "Temperatura",
            dot: false,
        },
        yAxisData: {
            orientation: "left",
            domain: ['auto', 'auto'],
        }
    },
    {
        id: "humidity",
        key: "humidity_pct",
        color: "#a855f7",
        type: "line",
        chartData: {
            type: "monotone",
            name: "Humedad",
            dot: false,
            strokeDasharray: "3 3"
        },
        yAxisData: {
            orientation: "right",
            domain: [0, 100],
        }
    },
];

export const chartPressureAndAltitude: MetricChartMetaData[] = [
    {
        id:"altitude",
        key: "altitude_m",
        color: "#a78bfa",
        type: "bar",
        chartData: {
            name: "Altitud",
            opacity: 1
        },
        yAxisData: {
            orientation: "left",
            domain:  ['auto', 'auto']
        }
    },
    {
        id: "pressure",
        key: "pressure_hpa",
        color: "#38bdf8",
        type: "bar",
        chartData: {
            name: "Presión",
            opacity: 1
        },
        yAxisData: {
            orientation: "right",
            domain: ['auto', 'auto'],
        }
    },
];