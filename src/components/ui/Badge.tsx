'use client';

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-white/5 text-text-secondary border-border',
  success:
    'bg-accent/10 text-accent border-accent/20',
  warning:
    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger:
    'bg-red-500/10 text-red-400 border-red-500/20',
  info:
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-tertiary',
  success: 'bg-accent',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border px-2.5 py-0.5
        text-xs font-medium leading-5
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
