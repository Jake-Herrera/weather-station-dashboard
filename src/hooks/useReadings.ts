import { useEffect, useState } from 'react';

import {
  onValue,
  ref,
} from 'firebase/database';

import { db } from '@/lib/firebase';

import type { Reading } from '@/types/reading';

export function useReadings(
  deviceId: string
) {
  const [readings, setReadings] =
    useState<Reading[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const readingsRef = ref(
      db,
      `readings/${deviceId}`
    );

    const unsubscribe = onValue(
      readingsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();

          if (!data) {
            setReadings([]);
            return;
          }

          const parsedReadings =
            Object.values(data) as Reading[];

          setReadings(parsedReadings);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error');
          }
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [deviceId]);

  return {
    readings,
    loading,
    error,
  };
}