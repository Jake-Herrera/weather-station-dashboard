import { vi } from 'vitest';

export function createMockSnapshot(data: unknown) {
  return {
    val: () => data,
    exists: () => data !== null,
  };
}

/**
 * Sets up mocks for the onValue pattern used by useReadings.
 * Call this inside beforeEach. Returns helpers to trigger the snapshot
 * and verify cleanup.
 */
export function setupOnValueMock(mockOnValue: ReturnType<typeof vi.fn>) {
  const mockUnsubscribe = vi.fn();
  let capturedCallback: ((snapshot: ReturnType<typeof createMockSnapshot>) => void) | null = null;

  mockOnValue.mockImplementation(
    (_ref: unknown, callback: (snapshot: ReturnType<typeof createMockSnapshot>) => void) => {
      capturedCallback = callback;
      return mockUnsubscribe;
    },
  );

  function triggerSnapshot(data: unknown) {
    if (!capturedCallback) throw new Error('onValue callback not yet registered');
    capturedCallback(createMockSnapshot(data));
  }

  return { mockUnsubscribe, triggerSnapshot };
}

/**
 * Returns a mock `get` function for the one-shot pattern used by useDeviceMeta.
 */
export function createGetMock(data: unknown) {
  return vi.fn().mockResolvedValue(createMockSnapshot(data));
}
