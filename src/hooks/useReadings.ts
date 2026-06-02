import { useEffect, useState } from 'react';

import {
  onValue,
  ref,
  query,
  orderByChild,
  startAt,
} from 'firebase/database';

import { db } from '@/lib/firebase';

import type { Reading, TimeRange } from '@/types/reading';
import { RANGE_TO_MS } from '@/constants/ranges';

type State = {
  readings: Reading[];
  loadedRange: TimeRange | null;
};

export function useReadings(
  deviceId: string,
  range: TimeRange,
) {
  const [state, setState] = useState<State>({
    readings: [],
    loadedRange: null,
  });

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const startTs = Date.now() - RANGE_TO_MS[range];

    const readingsRef = query(
      ref(db, `readings/${deviceId}`),
      orderByChild('ts'),
      startAt(startTs),
    );

    const unsubscribe = onValue(
      readingsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          const parsedReadings = data ? Object.values(data) as Reading[] : [];
          setState({ readings: parsedReadings, loadedRange: range });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setState(prev => ({ ...prev, loadedRange: range }));
        }
      }
    );

    return () => unsubscribe();
  }, [deviceId, range]);

  return {
    readings: state.readings,
    loading: state.loadedRange !== range,
    error,
  };
}
