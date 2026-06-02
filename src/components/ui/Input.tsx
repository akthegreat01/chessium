'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-bg-tertiary px-4 py-2.5 text-sm
              text-text-primary placeholder-text-muted
              transition-all duration-200
              outline-none
              ${icon ? 'pl-11' : ''}
              ${iconRight ? 'pr-11' : ''}
              ${
                error
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20 hover:border-border-hover'
              }
              ${className}
            `}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
