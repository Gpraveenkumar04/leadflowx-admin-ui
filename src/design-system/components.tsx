import React from 'react';
import { transitions } from './tokens';
import clsx from 'clsx';

/*****************
 * BUTTON
 *****************/
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  block?: boolean;
}

const buttonBase = 'inline-flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors';
const buttonSizes: Record<string, string> = {
  xs: 'text-xs h-7 px-2',
  sm: 'text-sm h-8 px-3',
  md: 'text-sm h-9 px-4',
  lg: 'text-base h-11 px-6'
};
const buttonVariants: Record<string, string> = {
  primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-500)] active:bg-[var(--color-primary-700)] focus-visible:ring-[var(--color-primary-500)]',
  secondary: 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] hover:bg-[var(--color-bg-inset)] active:bg-[var(--color-bg-inset)] focus-visible:ring-[var(--color-primary-400)]',
  outline: 'border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] active:bg-[var(--color-bg-inset)] focus-visible:ring-[var(--color-primary-500)]',
  ghost: 'text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] active:bg-[var(--color-bg-inset)] focus-visible:ring-[var(--color-primary-500)]',
  danger: 'bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-500)] active:bg-[var(--color-danger-700)] focus-visible:ring-[var(--color-danger-500)]'
};

export const Button: React.FC<ButtonProps> = ({ variant='primary', size='md', loading, leftIcon, rightIcon, block, className, children, ...rest }) => (
  <button
    className={clsx(buttonBase, buttonSizes[size], buttonVariants[variant], block && 'w-full', className)}
    {...rest}
  >
    {loading && (
      <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-current' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
      </svg>
    )}
    {leftIcon && <span className='mr-2 flex items-center'>{leftIcon}</span>}
    <span>{children}</span>
    {rightIcon && <span className='ml-2 flex items-center'>{rightIcon}</span>}
  </button>
);

/*****************
 * BADGE
 *****************/
export interface BadgeProps {
  color?: 'gray' | 'primary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

const badgeColors: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
  primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-200',
  success: 'bg-success-50 text-success-700 ring-1 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-warning-200',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-danger-200'
};
const badgeSizes: Record<string, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5'
};
export const Badge: React.FC<BadgeProps> = ({ color='gray', size='md', className, children }) => (
  <span className={clsx('inline-flex items-center font-medium rounded-full select-none', badgeColors[color], badgeSizes[size], className)}>{children}</span>
);

/*****************
 * CARD
 *****************/
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={clsx('bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg shadow-sm', className)} {...rest}>{children}</div>
);
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={clsx('px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between', className)} {...rest}>{children}</div>
);
export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={clsx('px-4 py-4', className)} {...rest}>{children}</div>
);
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={clsx('px-4 py-3 border-t border-gray-200 dark:border-secondary-700', className)} {...rest}>{children}</div>
);

/*****************
 * INPUT
 *****************/
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ leftIcon, rightIcon, error, className, ...rest }) => (
  <div className={clsx('relative', className)}>
    {leftIcon && <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--color-text-subtle)]'>{leftIcon}</span>}
    <input
      className={clsx(
        'w-full rounded-md border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] text-sm',
        leftIcon && 'pl-9',
        rightIcon && 'pr-9',
        error && 'border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]'
      )}
      {...rest}
    />
    {rightIcon && <span className='absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-subtle)]'>{rightIcon}</span>}
    {error && <p className='mt-1 text-xs text-[var(--color-danger-600)]'>{error}</p>}
  </div>
);

/*****************
 * SELECT
 *****************/
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...rest }) => (
  <select
    className={clsx('w-full rounded-md border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text)] focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] text-sm', className)}
    {...rest}
  >{children}</select>
);

/*****************
 * MODAL (basic)
 *****************/
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
const modalSizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' };
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, footer, size='md' }) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div className={clsx('relative bg-white dark:bg-secondary-800 rounded-lg shadow-hard w-full max-h-[90vh] overflow-hidden flex flex-col', modalSizes[size])}>
  {(title || typeof onClose === 'function') && (
          <div className='px-5 py-3 border-b border-gray-200 dark:border-secondary-700 flex items-center justify-between'>
            <h3 className='text-sm font-semibold tracking-wide'>{title}</h3>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>✕</button>
          </div>
        )}
        <div className='px-5 py-4 overflow-y-auto'>{children}</div>
        {footer && <div className='px-5 py-3 bg-gray-50 dark:bg-secondary-700 border-t border-gray-200 dark:border-secondary-700'>{footer}</div>}
      </div>
    </div>
  );
};

/*****************
 * TABLE SHELL
 *****************/
export const TableShell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('overflow-auto rounded-lg border border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-800', className)}>{children}</div>
);
export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, ...rest }) => (
  <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-secondary-700 text-sm', className)} {...rest} />
);
export const THead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...rest }) => (
  <thead className={clsx('bg-gray-50 dark:bg-secondary-700/40', className)} {...rest} />
);
export const TBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...rest }) => (
  <tbody className={clsx('divide-y divide-gray-100 dark:divide-secondary-700', className)} {...rest} />
);
export const TH: React.FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ className, ...rest }) => (
  <th className={clsx('px-3 py-2 text-left font-semibold text-[11px] tracking-wide uppercase text-gray-600 dark:text-gray-300', className)} {...rest} />
);
export const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...rest }) => (
  <td className={clsx('px-3 py-2 align-middle text-gray-700 dark:text-gray-100', className)} {...rest} />
);

/*****************
 * SKELETON
 *****************/
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse rounded bg-gray-200 dark:bg-secondary-700', className)} />
);

/*****************
 * UTILS
 *****************/
export const LoadingOverlay: React.FC<{ show: boolean; label?: string }> = ({ show, label='Loading...' }) => show ? (
  <div className='absolute inset-0 bg-white/70 dark:bg-secondary-900/60 flex items-center justify-center'>
    <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-200'>
      <svg className='animate-spin h-5 w-5 text-primary-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
      </svg>
      <span>{label}</span>
    </div>
  </div>
) : null;

/*****************
 * CHECKBOX
 *****************/
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, description, disabled, ...rest }, ref
) {
  return (
    <label className={clsx('flex items-start space-x-2 cursor-pointer select-none', disabled && 'opacity-60 cursor-not-allowed', className)}>
      <span className='inline-flex items-center h-5'>
        <input
          ref={ref}
          type='checkbox'
            className={clsx(
            'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-secondary-700 dark:border-secondary-600',
            'disabled:opacity-60'
          )}
          disabled={disabled}
          {...rest}
        />
      </span>
      {(label || description) && (
        <span className='flex flex-col -mt-0.5'>
          {label && <span className='text-sm font-medium text-gray-800 dark:text-gray-100'>{label}</span>}
          {description && <span className='text-xs text-gray-500 dark:text-gray-400'>{description}</span>}
        </span>
      )}
    </label>
  );
});

/*****************
 * TOGGLE (Switch)
 *****************/
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (next: boolean) => void;
  size?: 'sm' | 'md';
  label?: string;
}
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, size='md', label, className, disabled, ...rest }) => {
  const dims = size === 'sm' ? { w: 'w-9', h: 'h-5', dot: 'h-4 w-4', translate: 'translate-x-4' } : { w: 'w-11', h: 'h-6', dot: 'h-5 w-5', translate: 'translate-x-5' };
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx('relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
        dims.w, dims.h,
        checked ? 'bg-primary-600 hover:bg-primary-500' : 'bg-gray-300 hover:bg-gray-400 dark:bg-secondary-600 dark:hover:bg-secondary-500',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      <span
        className={clsx('pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition', dims.dot, checked ? dims.translate : 'translate-x-0')}
      />
    </button>
  );
};

/*****************
 * TOOLTIP (basic, pointer-enter)
 *****************/
export interface TooltipProps {
  label: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}
export const Tooltip: React.FC<TooltipProps> = ({ label, children, side='top', delay=250 }) => {
  const [open, setOpen] = React.useState(false);
  const [timer, setTimer] = React.useState<number | null>(null);
  const id = React.useId();
  const show = () => {
    if (timer) window.clearTimeout(timer);
    setTimer(window.setTimeout(() => setOpen(true), delay));
  };
  const hide = () => {
    if (timer) window.clearTimeout(timer);
    setOpen(false);
  };
  const pos: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  return (
    <span className='relative inline-flex' onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {React.cloneElement(children, { 'aria-describedby': id })}
      {open && (
        <span
          id={id}
          role='tooltip'
          className={clsx('absolute z-50 px-2 py-1 text-[11px] font-medium rounded-md bg-gray-900 text-white shadow-lg pointer-events-none select-none', pos[side], 'animate-fade-in')}
        >
          {label}
        </span>
      )}
    </span>
  );
};

/*****************
 * TOAST HELPERS (react-hot-toast wrapper)
 *****************/
import { toast } from 'react-hot-toast';
export const notify = {
  success: (msg: string, opts?: any) => toast.success(msg, opts),
  error: (msg: string, opts?: any) => toast.error(msg, opts),
  info: (msg: string, opts?: any) => toast(msg, { icon: 'ℹ️', ...opts }),
  promise: toast.promise
};
