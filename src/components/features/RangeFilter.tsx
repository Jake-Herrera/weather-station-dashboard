import type { TimeRange } from '@/types/reading';

import { RANGES } from '@/constants/ranges';

type Props = {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
};

export function RangeFilter({
  selectedRange,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`
            rounded-md px-3 py-1 border
            ${
              selectedRange === range
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }
          `}
        >
          {range}
        </button>
      ))}
    </div>
  );
}