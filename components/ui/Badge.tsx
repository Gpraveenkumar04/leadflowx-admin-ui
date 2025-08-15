import React from 'react';

interface BadgeProps { children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'secondary' }

export default function Badge({ children, variant='secondary' }: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  const cls = {
    success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
    warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)]',
    danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-700)]',
    secondary: 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
  }[variant];

  return <span className={`${base} ${cls}`} role="status" aria-live="polite">{children}</span>;
}
