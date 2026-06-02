'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-[0_0_20px_rgba(129,182,76,0.15)] hover:shadow-[0_0_30px_rgba(129,182,76,0.25)]',
  secondary:
    'bg-transparent border border-border text-text-secondary hover:border-accent hover:text-accent',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary',
  danger:
    'bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 hover:border-red-500/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl',
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? 'h-4 w-4'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconRight,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Spinner className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />}
      {!isLoading && icon && <span className="shrink-0">{icon}</span>}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
        </span>
      )}
      {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
