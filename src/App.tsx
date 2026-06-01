import { useState } from 'react';
import { RangeFilter } from '@/components/features/RangeFilter';
import { MetricCard } from '@/components/features/MetricCard';
import { DEFAULT_RANGE } from '@/constants/ranges';
import { useReadings } from '@/hooks/useReadings';
import { filterReadingsByRange } from '@/services/filter-readings';
import { computeStats } from '@/services/compute-stats';
import type { TimeRange } from '@/types/reading';
import { TrendChart } from '@/components/features/TrendChart';
import { RealTimer } from '@/components/features/RealTimer';
import DeviceMeta from './components/features/DeviceMeta';

const DEVICE_ID = import.meta.env.VITE_DEVICE_ID ?? 'esp32-01';

function App() {
  const [range, setRange] = useState<TimeRange>(DEFAULT_RANGE);
  const { readings, loading, error } = useReadings(DEVICE_ID);

  const visibleReadings = filterReadingsByRange(readings, range);

  const tempStats = computeStats(visibleReadings, 'temp_c');
  const pressureStats = computeStats(visibleReadings, 'pressure_hpa');
  const altitudeStats = computeStats(visibleReadings, 'altitude_m');
  const humidityStats = computeStats(visibleReadings, 'humidity_pct');

  return (
    <div className="min-h-screen bg-atmosphere px-8 py-7">
      <div className='flex flex-col-reverse gap-[10px] lg:justify-between lg:flex-row'>
        <DeviceMeta deviceId={DEVICE_ID} />
        <RealTimer/>
      </div>
      
      <RangeFilter selectedRange={range} onChange={setRange} />

      {loading && <p className="mt-4 text-gray-400">Loading…</p>}
      {error && <p className="mt-4 text-red-400">Error: {error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <MetricCard metric="temp_c" stats={tempStats} />
        <MetricCard metric="pressure_hpa" stats={pressureStats} />
        <MetricCard metric="altitude_m" stats={altitudeStats} />
        <MetricCard metric="humidity_pct" stats={humidityStats} />
      </div>
      <div className="mt-4">
        <TrendChart readings={visibleReadings} />
      </div>
    </div>
  );
}

export default App;
