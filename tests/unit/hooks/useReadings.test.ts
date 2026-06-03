import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { setupOnValueMock } from '../helpers/firebase-mock';
import type { Reading } from '@/types/reading';

// Mock firebase/database before importing the hook.
const mockOnValue = vi.fn();
const mockRef = vi.fn().mockReturnValue({});
const mockQuery = vi.fn().mockReturnValue({});
const mockOrderByChild = vi.fn().mockReturnValue({});
const mockStartAt = vi.fn().mockReturnValue({});

vi.mock('firebase/database', () => ({
  onValue: mockOnValue,
  ref: mockRef,
  query: mockQuery,
  orderByChild: mockOrderByChild,
  startAt: mockStartAt,
}));

vi.mock('@/lib/firebase', () => ({ db: {} }));

// Import AFTER mocks are registered.
const { useReadings } = await import('@/hooks/useReadings');

const SAMPLE_READINGS: Reading[] = [
  { ts: 1_700_000_000_000, temp_c: 20, pressure_hpa: 1013, altitude_m: 100, humidity_pct: 50 },
  { ts: 1_700_000_001_000, temp_c: 21, pressure_hpa: 1013, altitude_m: 100, humidity_pct: 51 },
];

describe('useReadings', () => {
  let triggerSnapshot: (data: unknown) => void;
  let mockUnsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    ({ triggerSnapshot, mockUnsubscribe } = setupOnValueMock(mockOnValue));
  });

  it('starts in loading state before Firebase responds', () => {
    const { result } = renderHook(() => useReadings('device-1', '1h'));

    expect(result.current.loading).toBe(true);
    expect(result.current.readings).toEqual([]);
  });

  it('loading becomes false after onValue fires', async () => {
    const { result } = renderHook(() => useReadings('device-1', '1h'));

    triggerSnapshot({ r1: SAMPLE_READINGS[0] });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('readings are populated from the snapshot data', async () => {
    const { result } = renderHook(() => useReadings('device-1', '1h'));

    triggerSnapshot({ r1: SAMPLE_READINGS[0], r2: SAMPLE_READINGS[1] });

    await waitFor(() => expect(result.current.readings).toHaveLength(2));
  });

  it('readings is an empty array when the snapshot returns null', async () => {
    const { result } = renderHook(() => useReadings('device-1', '1h'));

    triggerSnapshot(null);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.readings).toEqual([]);
  });

  it('the unsubscribe function is called when the hook unmounts', () => {
    const { unmount } = renderHook(() => useReadings('device-1', '1h'));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});
