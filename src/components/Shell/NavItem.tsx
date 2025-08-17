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
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        active
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-100 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      <Icon className={clsx(
        'h-5 w-5 flex-shrink-0',
        active
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400'
      )} />
      {!collapsed && label && (
        <span className={clsx(
          'truncate',
          active && 'font-medium'
        )}>
          {label}
        </span>
      )}
      {badge && !collapsed && (
        <span className={clsx(
          'ml-auto flex-shrink-0 py-0.5 px-2 text-xs font-medium rounded-full',
          active
            ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
            : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
        )}>
          {badge}
        </span>
      )}
    </Link>
  );
};

export default NavItem;
