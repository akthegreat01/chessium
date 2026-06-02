import React from 'react';

type SkeletonVariant = 'text' | 'circle' | 'card' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

function ShimmerOverlay() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
  );
}

export default function Skeleton({
  variant = 'rect',
  width,
  height,
  className = '',
  lines = 1,
}: SkeletonProps) {
  const baseClass = 'relative overflow-hidden bg-white/[0.04] rounded';

  if (variant === 'text') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4 rounded-md`}
            style={{
              width: i === lines - 1 && lines > 1 ? '70%' : (width ?? '100%'),
            }}
          >
            <ShimmerOverlay />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    const size = width ?? height ?? 48;
    return (
      <div
        className={`${baseClass} rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <ShimmerOverlay />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`${baseClass} rounded-2xl border border-border ${className}`}
        style={{ width: width ?? '100%', height: height ?? 200 }}
      >
        <ShimmerOverlay />
      </div>
    );
  }

  // rect (default)
  return (
    <div
      className={`${baseClass} rounded-xl ${className}`}
      style={{ width: width ?? '100%', height: height ?? 40 }}
    >
      <ShimmerOverlay />
    </div>
  );
}
