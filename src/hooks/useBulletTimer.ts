import { useState, useEffect, useRef, useCallback } from 'react';

export function useBulletTimer(initialSeconds: number, onExpire?: () => void) {
  const [timeLeftMs, setTimeLeftMs] = useState(initialSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);
  const isExpired = useRef(false);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current != undefined) {
      const deltaTime = time - lastTimeRef.current;
      setTimeLeftMs(prevTime => {
        const newTime = prevTime - deltaTime;
        if (newTime <= 0) {
          if (!isExpired.current) {
            isExpired.current = true;
            setIsRunning(false);
            if (onExpire) setTimeout(onExpire, 0); // push to next tick
          }
          return 0;
        }
        return newTime;
      });
    }
    
    lastTimeRef.current = time;
    if (isRunning && !isExpired.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, onExpire]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
    };
  }, [isRunning, animate]);

  const start = useCallback(() => {
    if (timeLeftMs > 0 && !isExpired.current) {
      setIsRunning(true);
      lastTimeRef.current = performance.now();
    }
  }, [timeLeftMs]);

  const pause = useCallback(() => {
    setIsRunning(false);
    lastTimeRef.current = undefined;
  }, []);

  const addTime = useCallback((ms: number) => {
    setTimeLeftMs(prev => prev + ms);
  }, []);

  // For premoves, bullet standard says premove takes 0.1s
  const consumePremoveTime = useCallback(() => {
    setTimeLeftMs(prev => Math.max(0, prev - 100));
  }, []);

  // Format the time as M:SS.d
  const formattedTime = () => {
    const totalSeconds = Math.max(0, timeLeftMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${tenths}`;
  };

  return {
    timeLeftMs,
    isRunning,
    start,
    pause,
    addTime,
    consumePremoveTime,
    formattedTime,
    isExpired: isExpired.current
  };
}
