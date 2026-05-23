import type { MetricStats } from '@/services/compute-stats';

type Props = {
  label: string; // "TEMPERATURA"
  unit: string; // "°C"
  stats: MetricStats | null;
  decimals?: number; // how many decimals to show
};

export function MetricCard({ label, unit, stats, decimals = 1 }: Props) {
  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
        <p className="text-xs tracking-widest text-gray-400">{label}</p>
        <p className="mt-4 text-gray-500">No data</p>
      </div>
    );
  }

  const fmt = (n: number) => n.toFixed(decimals);

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <p className="text-xs tracking-widest text-gray-400">{label}</p>

      {/* Current value, big */}
      <p className="mt-2 text-5xl font-semibold text-white">
        {fmt(stats.current)}
        <span className="ml-1 text-xl text-gray-400">{unit}</span>
      </p>

      {/* Stats row */}
      <div className="mt-4 flex gap-6 text-xs">
        <div>
          <p className="text-gray-500">MÁX</p>
          <p className="text-gray-200">{fmt(stats.max)}{unit}</p>
        </div>
        <div>
          <p className="text-gray-500">MÍN</p>
          <p className="text-gray-200">{fmt(stats.min)}{unit}</p>
        </div>
        <div>
          <p className="text-gray-500">MEDIA</p>
          <p className="text-gray-200">{fmt(stats.avg)}{unit}</p>
        </div>
        <div>
          <p className="text-gray-500">Δ RANGO</p>
          <p className="text-gray-200">{fmt(stats.rangeDelta)}{unit}</p>
        </div>
      </div>
    </div>
  );
}