'use client';

import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  as = 'div',
  onClick,
}: CardProps) {
  const Component = motion.create(as);

  return (
    <Component
      className={`
        relative overflow-hidden rounded-2xl
        bg-[rgba(26,26,31,0.6)] backdrop-blur-xl
        border border-border
        ${paddingStyles[padding]}
        ${glow ? 'shadow-[0_0_20px_rgba(129,182,76,0.1)]' : 'shadow-[0_4px_24px_rgba(0,0,0,0.3)]'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...(hover
        ? {
            whileHover: {
              y: -2,
              borderColor: 'rgba(129,182,76,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(129,182,76,0.1)',
            },
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          }
        : {})}
      onClick={onClick}
    >
      {/* Subtle gradient overlay at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </Component>
  );
}
