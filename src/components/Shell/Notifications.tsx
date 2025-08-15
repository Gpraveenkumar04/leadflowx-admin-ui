import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { clsx } from 'clsx';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  open: boolean;
  currentTheme: 'light' | 'dark';
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, open, currentTheme }) => {
  if (!open) return null;
  return (
    <div className="origin-top-right absolute right-4 z-50 mt-20 w-80 radius-lg shadow-lg py-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] backdrop-blur">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className={clsx("text-sm font-semibold", currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-gray-500">No new notifications</div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((notification) => (
        <div key={notification.id} className={clsx('px-4 py-3 flex items-start radius-md cursor-pointer', notification.read ? 'hover:bg-[var(--color-bg-hover)] opacity-80' : 'bg-[var(--color-bg-accent-subtle)] hover:bg-[var(--color-bg-accent-muted)]')}>
              <div className="flex-shrink-0 pt-0.5">
            <div className={clsx("h-8 w-8 radius-full flex items-center justify-center", notification.read ? 'bg-[var(--color-bg-muted)]' : 'bg-[var(--color-bg-accent)]')}>
                  <BellIcon className={clsx("h-5 w-5", notification.read ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-accent-text-contrast)]')} />
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className={clsx("text-sm font-medium", 'text-[var(--color-text-primary)]')}>{notification.text}</p>
                <p className={clsx("mt-1 text-xs", 'text-[var(--color-text-muted)]')}>{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-[var(--color-border-subtle)] px-4 py-2">
        <Link href="#all-notifications" className="block text-xs font-medium text-center text-[var(--color-accent-600)] hover:text-[var(--color-accent-500)]">View all notifications</Link>
      </div>
    </div>
  );
};

export default Notifications;
