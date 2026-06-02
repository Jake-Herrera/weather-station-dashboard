import { useState } from 'react';
import { RangeFilter } from '@/components/features/RangeFilter';
import { MetricCard } from '@/components/features/MetricCard';
import { DEFAULT_RANGE } from '@/constants/ranges';
import { useReadings } from '@/hooks/useReadings';
import { computeStats } from '@/services/compute-stats';
import { downsampleReadings } from '@/services/downsample-readings';
import type { TimeRange } from '@/types/reading';
import { TrendChart } from '@/components/features/TrendChart';
import { RealTimer } from '@/components/features/RealTimer';
import DeviceMeta from './components/features/DeviceMeta';
import { chartTemperatureAndHumidity, chartPressureAndAltitude } from '@/constants/metrics';
import { DashboardSkeleton } from '@/components/features/DashboardSkeleton';

const DEVICE_ID = import.meta.env.VITE_DEVICE_ID ?? 'esp32-tes';

function App() {
  const [range, setRange] = useState<TimeRange>(DEFAULT_RANGE);
  const { readings, loading, error } = useReadings(DEVICE_ID, range);

  const chartReadings = downsampleReadings(readings, range);

  const tempStats = computeStats(readings, 'temp_c');
  const pressureStats = computeStats(readings, 'pressure_hpa');
  const altitudeStats = computeStats(readings, 'altitude_m');
  const humidityStats = computeStats(readings, 'humidity_pct');

  return (
    <div className="min-h-screen bg-atmosphere px-8 py-7">
      <div className='flex flex-col-reverse gap-[10px] lg:justify-between lg:flex-row'>
        <DeviceMeta deviceId={DEVICE_ID} />
        <RealTimer/>
      </div>

      <RangeFilter selectedRange={range} onChange={setRange} />

      {error && <p className="mt-4 text-red-400">Error: {error}</p>}

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
              <MetricCard metric="temp_c" stats={tempStats} />
              <MetricCard metric="humidity_pct" stats={humidityStats} />
              <MetricCard metric="altitude_m" stats={altitudeStats} />
              <MetricCard metric="pressure_hpa" stats={pressureStats} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TrendChart readings={chartReadings} metadata={chartTemperatureAndHumidity}/>
              <TrendChart readings={chartReadings} metadata={chartPressureAndAltitude}/>
            </div>      
        </>
      ) }
    </div>
  );
}

export default App;
