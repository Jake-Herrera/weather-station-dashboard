import { useEffect, useState } from "react";

export const RealTimer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center gap-3.5">
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.043] border border-white/10 text-[11px] text-[#b8c0d0]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]"></span>
        Tiempo real
      </div>
      <span className="px-3 py-1.5 rounded-[10px] bg-white/[0.07] border border-white/10 text-sm text-white">
        {formattedTime}
      </span>
    </div>
  );
};
