import React from 'react';
import { clsx } from 'clsx';

interface SidebarGroupProps {
  title?: string;
  children: React.ReactNode;
  open?: boolean;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children, open = true }) => {
  return (
    <div className={clsx('mb-2', !open && 'hidden')}>
      {title && <div className="px-2 text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">{title}</div>}
      <div className="space-y-1 px-1">{children}</div>
    </div>
  );
};

export default SidebarGroup;
