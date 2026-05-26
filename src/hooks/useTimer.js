import { useEffect, useRef } from 'react';
import useStore from '../store';

export function useTimer() {
  const isRunning = useStore((s) => s.isRunning);
  const tick = useStore((s) => s.tick);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 200);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isRunning, tick]);
}
