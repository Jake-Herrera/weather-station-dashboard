import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createGetMock } from '../helpers/firebase-mock';
import type { DeviceMeta } from '@/types/device';

const mockGet = vi.fn();
const mockRef = vi.fn().mockReturnValue({});

vi.mock('firebase/database', () => ({
  get: mockGet,
  ref: mockRef,
}));

vi.mock('@/lib/firebase', () => ({ db: {} }));

const { useDeviceMeta } = await import('@/hooks/useDeviceMeta');

const SAMPLE_DEVICE: DeviceMeta = {
  name: 'Roof Sensor',
  location: 'San José, CR',
  elevation_m: 1150,
};

describe('useDeviceMeta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useDeviceMeta('device-1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.device).toBeNull();
  });

  it('loading is false after the fetch resolves successfully', async () => {
    mockGet.mockImplementation(createGetMock(SAMPLE_DEVICE));

    const { result } = renderHook(() => useDeviceMeta('device-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('device metadata is returned when the snapshot exists', async () => {
    mockGet.mockImplementation(createGetMock(SAMPLE_DEVICE));

    const { result } = renderHook(() => useDeviceMeta('device-1'));

    await waitFor(() => expect(result.current.device).toEqual(SAMPLE_DEVICE));
  });

  it('loading is false after the fetch fails', async () => {
    mockGet.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useDeviceMeta('device-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('error is set when the device node does not exist in Firebase', async () => {
    mockGet.mockImplementation(createGetMock(null)); // exists() returns false

    const { result } = renderHook(() => useDeviceMeta('device-1'));

    await waitFor(() => expect(result.current.error).toBe('Device not found'));
    expect(result.current.device).toBeNull();
  });
});
