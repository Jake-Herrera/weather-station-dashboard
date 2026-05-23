import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';

import { db } from '@/lib/firebase';

import type { DeviceMeta } from '@/types/reading';

export function useDeviceMeta(deviceId: string) {
  const [device, setDevice] = useState<DeviceMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeviceMeta() {
      try {
        const snapshot = await get(
          ref(db, `devices/${deviceId}`)
        );

        if (!snapshot.exists()) {
          throw new Error('Device not found');
        }

        setDevice(snapshot.val());
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

    fetchDeviceMeta();
  }, [deviceId]);

  return {
    device,
    loading,
    error,
  };
}