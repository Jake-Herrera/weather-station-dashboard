import { useDeviceMeta } from "@/hooks/useDeviceMeta";
import { CloudSun } from 'lucide-react';

type Props = {
  deviceId: string;
};

// Shared classes for the small uppercase label line (avoids repeating them)
const labelClasses =
  "text-[11px] font-semibold tracking-[0.16em] uppercase text-[#dce4f5]/55";

export function DeviceMeta({ deviceId }: Props) {
  const { device, loading, error } = useDeviceMeta(deviceId);

  return (
    <div className="flex items-center gap-3.5">
      {/* Logo placeholder */}
      <div className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.07]">
        <CloudSun className="h-5 w-5 text-white/80" />
      </div>

      <div className="flex flex-col">
        {/* Top label: device identity (or loading/error state) */}
        {loading && <p className={labelClasses}>Cargando…</p>}

        {error && (
          <p className={`${labelClasses} text-red-400`}>Sin conexión</p>
        )}

        {device && (
          <p className={labelClasses}>
            {device.name} · {device.location}
            {device.elevation_m != null && ` · ${device.elevation_m} m`}
          </p>
        )}

        {/* Main title */}
        <h1 className="mt-0.5 text-base font-medium text-white">
          Centro de monitoreo atmosférico
        </h1>
      </div>
    </div>
  );
}

export default DeviceMeta;
