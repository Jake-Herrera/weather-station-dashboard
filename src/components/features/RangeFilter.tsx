import type { TimeRange } from '@/types/reading';

import { RANGES } from '@/constants/ranges';

type Props = {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
};

const baseClasses = "rounded-md px-3 py-1 border flex-initial cursor-pointer rounded-lg border-0  px-4.5 py-1.75 text-xs";
const activeClasses = "bg-white/[0.07] font-semibold tracking-[0.04em] text-[#f2f4f8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),0_0_0_1px_rgba(125,211,252,0.18)] transition-[background,color,box-shadow] duration-150";
const inactiveClasses = "bg-transparent font-medium tracking-[0.04em] text-[#dce4f5]/55 shadow-none transition-[background,color,box-shadow] duration-150";

export function RangeFilter({
  selectedRange,
  onChange,
}: Props) {
    return (
        <div className="relative z-1 flex w-fit self-start gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
        {RANGES.map((range) => (
            <button
            key={range}
            onClick={() => onChange(range)}
            className={`${baseClasses}
                ${
                    selectedRange === range
                    ? activeClasses
                    : inactiveClasses
                }
            `}
            >
            {range}
            </button>
        ))}
        </div>
    );
}