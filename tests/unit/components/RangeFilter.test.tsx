import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);
import { RangeFilter } from '@/components/features/RangeFilter';
import { RANGES } from '@/constants/ranges';

describe('RangeFilter', () => {
  it('renders all five range buttons', () => {
    render(<RangeFilter selectedRange="24h" onChange={vi.fn()} />);

    for (const range of RANGES) {
      expect(screen.getByRole('button', { name: range })).toBeDefined();
    }
  });

  it('the selected range button has the active styling class', () => {
    render(<RangeFilter selectedRange="6h" onChange={vi.fn()} />);

    const activeButton = screen.getByRole('button', { name: '6h' });
    // The active class includes a distinctive substring not present on inactive buttons.
    expect(activeButton.className).toContain('bg-white/[0.07]');
  });

  it('unselected range buttons do not have the active styling class', () => {
    render(<RangeFilter selectedRange="6h" onChange={vi.fn()} />);

    const inactiveRanges = RANGES.filter((r) => r !== '6h');
    for (const range of inactiveRanges) {
      const btn = screen.getByRole('button', { name: range });
      expect(btn.className).not.toContain('bg-white/[0.07]');
    }
  });

  it('clicking a different range calls onChange with that range value', () => {
    const onChange = vi.fn();
    render(<RangeFilter selectedRange="24h" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: '7d' }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('7d');
  });
});
