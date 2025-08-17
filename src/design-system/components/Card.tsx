import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const cardVariants = cva(
  'rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
        ghost: 'border border-gray-200 dark:border-gray-700',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const cardHeaderVariants = cva(
  'px-6 py-4',
  {
    variants: {
      variant: {
        default: 'border-b border-gray-200 dark:border-gray-700',
        clean: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  action?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(cardVariants({ variant, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(cardHeaderVariants({ variant, className }))}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {children}
          </div>
          {action && (
            <div className="flex items-center ml-4">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
