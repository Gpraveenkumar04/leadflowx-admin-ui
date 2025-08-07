import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CogIcon,
  ChartBarIcon,
  CodeBracketIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Leads', href: '/leads', icon: UsersIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'QA Queue', href: '/qa', icon: CheckCircleIcon, badge: 12 },
  { name: 'Configuration', href: '/config', icon: CogIcon },
  { name: 'Metrics', href: '/metrics', icon: ChartBarIcon },
  { name: 'Dev Portal', href: '/dev', icon: CodeBracketIcon },
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === '/dashboard' || router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className={clsx(
        'fixed inset-0 z-40 flex lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">LeadFlowX</span>
            </div>
          </div>
          
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={clsx(
                    'mr-3 flex-shrink-0 h-6 w-6',
                    isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="w-14 flex-shrink-0" />
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">LeadFlowX</span>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-6 w-6',
                      isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1" />
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
