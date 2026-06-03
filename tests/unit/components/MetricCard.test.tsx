import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import { MetricCard } from '@/components/features/MetricCard';
import type { MetricStats } from '@/services/compute-stats';

const SAMPLE_STATS: MetricStats = {
  current: 22.567,
  max: 25.1,
  min: 18.3,
  avg: 21.8,
  rangeDelta: 6.8,
};

describe('MetricCard', () => {
  it('renders the TEMPERATURA label for metric="temp_c"', () => {
    render(<MetricCard metric="temp_c" stats={SAMPLE_STATS} />);

    expect(screen.getByText('TEMPERATURA')).toBeDefined();
  });

  it('renders the °C unit for metric="temp_c"', () => {
    render(<MetricCard metric="temp_c" stats={SAMPLE_STATS} />);

    // Unit appears in the big current-value span and in stats row items.
    const units = screen.getAllByText('°C');
    expect(units.length).toBeGreaterThan(0);
  });

  it('formats the current value to 1 decimal place for temp_c', () => {
    render(<MetricCard metric="temp_c" stats={SAMPLE_STATS} />);

    // 22.567 rounded to 1 decimal → "22.6"
    expect(screen.getByText('22.6')).toBeDefined();
  });

  it('formats the current value to 0 decimal places for altitude_m', () => {
    const stats: MetricStats = { ...SAMPLE_STATS, current: 1149.7 };
    render(<MetricCard metric="altitude_m" stats={stats} />);

    // 1149.7 rounded to 0 decimals → "1150"
    expect(screen.getByText('1150')).toBeDefined();
  });

  it('shows "No data" when stats is null', () => {
    render(<MetricCard metric="temp_c" stats={null} />);

    expect(screen.getByText('No data')).toBeDefined();
  });

  it('shows max, min, avg, and rangeDelta values from stats', () => {
    render(<MetricCard metric="temp_c" stats={SAMPLE_STATS} />);

    // Each formatted value (1 decimal for temp_c) concatenated with the unit.
    expect(screen.getByText('25.1°C')).toBeDefined();
    expect(screen.getByText('18.3°C')).toBeDefined();
    expect(screen.getByText('21.8°C')).toBeDefined();
    expect(screen.getByText('6.8°C')).toBeDefined();
  });
});
