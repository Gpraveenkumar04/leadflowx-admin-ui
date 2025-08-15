import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface NavItemProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label?: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: number;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, active, collapsed, badge, onClick }) => {
  return (
    <Link href={href} onClick={onClick} className={clsx('group flex items-center', 'transition-colors', active ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}>
      <Icon className={clsx('h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]')} />
      {!collapsed && label && <span className="ml-2 truncate">{label}</span>}
      {badge && !collapsed && <span className="ml-auto text-[10px] radius-md px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{badge}</span>}
    </Link>
  );
};

export default NavItem;
