import React from 'react';
import Link from 'next/link';
import { Bars3Icon, BellIcon, UserCircleIcon, MoonIcon, SunIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>

            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm font-medium">
                <li>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                {routerPath !== '/dashboard' && routerPath !== '/' && (
                  <>
                    <li className="flex items-center">
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {routerPath.split('/')[1].replace(/-/g, ' ')}
                      </span>
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDensity}
                className={clsx(
                  "px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                  "text-gray-700 dark:text-gray-300",
                  "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50",
                  "border border-gray-200 dark:border-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                )}
                aria-label="Toggle density"
                title={`Switch to ${density === 'comfortable' ? 'compact' : 'comfortable'} density`}
              >
                <span className="hidden md:inline">{density === 'comfortable' ? 'Comfortable' : 'Compact'}</span>
                <span className="md:hidden">{density === 'comfortable' ? 'Cmf' : 'Cmp'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                )}
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
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  )}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2 p-1.5 rounded-lg transition-all",
                    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  )}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-white dark:ring-gray-700">
                    <UserCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">Admin User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
