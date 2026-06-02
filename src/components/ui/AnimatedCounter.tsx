'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatLargeNumbers?: boolean;
}

function formatNumber(value: number, formatLarge: boolean): string {
  if (!formatLarge) return Math.round(value).toLocaleString();

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1).replace(/\.0$/, '')}K+`;
  }
  return Math.round(value).toLocaleString();
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  formatLargeNumbers = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      setDisplayValue(easedProgress * target);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animate();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [animate, hasAnimated]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatNumber(displayValue, formatLargeNumbers)}
      {suffix}
    </span>
  );
}
