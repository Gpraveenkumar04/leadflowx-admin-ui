import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const inputVariants = cva(
  'block w-full rounded-lg border text-sm transition-shadow duration-200 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error: 'border-danger-500 bg-white dark:bg-gray-800 text-danger-900 placeholder:text-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5',
        lg: 'px-4 py-3 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, hint, leftElement, rightElement, containerClassName, ...props }, ref) => {
    return (
      <div className={clsx('flex flex-col space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              inputVariants({ variant: error ? 'error' : variant, size, className }),
              leftElement && 'pl-10',
              rightElement && 'pr-10'
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {(error || hint) && (
          <div
            className={clsx(
              'text-xs',
              error ? 'text-danger-600' : 'text-gray-500'
            )}
            id={error ? `${props.id}-error` : `${props.id}-hint`}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
