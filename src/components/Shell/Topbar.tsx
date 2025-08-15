import React from 'react';
import Link from 'next/link';
import { Bars3Icon, BellIcon, UserCircleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface TopbarProps {
  setSidebarOpen: (open: boolean) => void;
  currentTheme: 'light' | 'dark';
  toggleDensity: () => void;
  density: 'comfortable' | 'compact';
  toggleTheme: () => void;
  notificationOpen: boolean;
  setNotificationOpen: (next: boolean) => void;
  notifications: Array<{ id: number; text: string; time: string; read: boolean }>;
  userMenuOpen: boolean;
  setUserMenuOpen: (next: boolean) => void;
  routerPath: string;
}

export const Topbar: React.FC<TopbarProps> = ({ setSidebarOpen, currentTheme, toggleDensity, density, toggleTheme, notificationOpen, setNotificationOpen, notifications, userMenuOpen, setUserMenuOpen, routerPath }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--toolbar-bg-translucent)] bg-[var(--color-bg-elevated)]/90 border-b border-[var(--color-border-subtle)] flex items-center h-14 sm:h-16 shadow-sm transition-colors">
      <div className="flex-1 flex px-3 sm:px-4 items-center gap-2 justify-between">
        <button
          type="button"
          className={clsx(
            "lg:hidden p-2 radius-md",
            currentTheme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" />
        </button>

        <nav className="hidden sm:flex items-center text-sm text-[var(--color-text-muted)]" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/dashboard" className="hover:text-[var(--color-text-primary)] font-medium">Dashboard</Link>
            </li>
            {routerPath !== '/dashboard' && routerPath !== '/' && (
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-border-soft)]">/</span>
                <span className="capitalize font-medium text-[var(--color-text-primary)]">{routerPath.split('/')[1]}</span>
              </li>
            )}
          </ol>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleDensity}
            className="px-2 h-8 inline-flex items-center gap-1 text-xs font-medium radius-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            aria-label="Toggle density"
            title={`Switch to ${density === 'comfortable' ? 'compact' : 'comfortable'} density`}
          >
            <span className="hidden md:inline">{density === 'comfortable' ? 'Comfort' : 'Compact'}</span>
            <span className="md:hidden">{density === 'comfortable' ? 'C' : 'Cm'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 radius-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            aria-label={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {currentTheme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setUserMenuOpen(false);
              }}
              className="p-2 rounded-md relative text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            >
              <BellIcon className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[var(--color-status-error)] ring-2 ring-[var(--color-bg-elevated)]" />
              )}
            </button>

            {/* Notification dropdown is rendered by LayoutCore to keep stateful markup centralized. */}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            >
              <span className="sr-only">Open user menu</span>
                <div className={clsx(
                "h-8 w-8 radius-full overflow-hidden flex items-center justify-center",
                currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <UserCircleIcon className="h-7 w-7 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
