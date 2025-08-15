import React from 'react';
import Link from 'next/link';

interface UserMenuProps {
  open: boolean;
  userNavigation: { name: string; href: string }[];
}

export const UserMenu: React.FC<UserMenuProps> = ({ open, userNavigation }) => {
  if (!open) return null;
  return (
    <div className="origin-top-right absolute right-4 z-50 mt-20 w-48 radius-lg shadow-lg py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">Jane Doe</p>
        <p className="text-xs truncate text-[var(--color-text-muted)]">jane.doe@example.com</p>
      </div>
      {userNavigation.map((item) => (
        <Link key={item.name} href={item.href} className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]">{item.name}</Link>
      ))}
    </div>
  );
};

export default UserMenu;
