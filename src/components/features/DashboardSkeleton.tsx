// Mirrors the structure of the real dashboard: 4 metric cards on top,
// 2 chart panels below. Boxes pulse to communicate loading.
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Top row: 4 metric cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Bottom row: 2 chart panels */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartPanelSkeleton />
        <ChartPanelSkeleton />
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-700/40 bg-white/[0.02] p-5">
      {/* Label (small, top) */}
      <div className="h-3 w-24 rounded bg-white/10" />

      {/* Big value */}
      <div className="mt-3 h-10 w-32 rounded bg-white/10" />

      {/* Stats row */}
      <div className="mt-5 flex gap-6 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-2 w-10 rounded bg-white/10" />
            <div className="mt-2 h-3 w-14 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartPanelSkeleton() {
  return (
    <div className="rounded-xl border border-gray-700/40 bg-white/[0.02] p-5">
      {/* Panel title */}
      <div className="h-3 w-48 rounded bg-white/10" />

      {/* Chart body */}
      <div className="mt-6 h-[380px] rounded bg-white/[0.04]" />
    </div>
  );
}