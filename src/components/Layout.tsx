import React, { ReactNode, useState, useEffect } from 'react';
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
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
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
  submenu?: NavigationItem[];
}

interface Theme {
  name: 'light' | 'dark';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { 
    name: 'Leads', 
    href: '/leads', 
    icon: UsersIcon,
    submenu: [
      { name: 'All Leads', href: '/leads', icon: UsersIcon },
      { name: 'Approved Leads', href: '/leads?status=approved', icon: CheckCircleIcon },
      { name: 'Rejected Leads', href: '/leads?status=rejected', icon: XMarkIcon },
      { name: 'Needs Review', href: '/leads?status=needs_review', icon: BriefcaseIcon }
    ]
  },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Scraper Workers', href: '/scraper-workers', icon: Cog6ToothIcon },
  { name: 'QA Queue', href: '/qa', icon: CheckCircleIcon, badge: 12 },
  { name: 'Metrics', href: '/metrics', icon: ChartBarIcon },
  { 
    name: 'Settings', 
    href: '/config', 
    icon: CogIcon,
    submenu: [
      { name: 'General Config', href: '/config', icon: Cog6ToothIcon },
      { name: 'API Settings', href: '/config/api', icon: CodeBracketIcon },
      { name: 'User Management', href: '/config/users', icon: UsersIcon },
    ]
  },
  { name: 'Dev Portal', href: '/dev', icon: CodeBracketIcon },
];

const userNavigation = [
  { name: 'Your Profile', href: '#profile' },
  { name: 'Notifications', href: '#notifications' },
  { name: 'Settings', href: '#settings' },
  { name: 'Sign out', href: '#signout' },
];

const themes: Theme[] = [
  { name: 'light', icon: SunIcon },
  { name: 'dark', icon: MoonIcon },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New lead verification completed', time: '2 min ago', read: false },
    { id: 2, text: 'System maintenance scheduled', time: '1 hour ago', read: false },
    { id: 3, text: 'Lead scoring updated', time: '3 hours ago', read: true },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === '/dashboard' || router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };
  
  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };

  return (
    <div className={clsx(
      "min-h-screen transition-colors duration-200",
      currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className={clsx(
          "h-full flex flex-col overflow-hidden shadow-xl",
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        )}>
          {/* Mobile sidebar header */}
          <div className={clsx(
            "flex items-center justify-between h-16 px-4 border-b",
            currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className={clsx(
                "ml-3 text-xl font-semibold",
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>LeadFlowX</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                currentTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Search in mobile sidebar */}
          <div className="p-4">
            <div className={clsx(
              "relative rounded-md shadow-sm",
              currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  "block w-full pl-10 pr-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder:text-gray-400 border-gray-600' 
                    : 'bg-gray-100 text-gray-900 placeholder:text-gray-500 border-gray-300'
                )}
                placeholder="Search"
              />
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={clsx(
                        "w-full group flex items-center justify-between px-2 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isActive(item.href)
                          ? currentTheme === 'dark' 
                            ? 'bg-gray-700 text-white' 
                            : 'bg-primary-100 text-primary-900'
                          : currentTheme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={clsx(
                            'mr-3 flex-shrink-0 h-5 w-5',
                            isActive(item.href) 
                              ? 'text-primary-500' 
                              : currentTheme === 'dark'
                                ? 'text-gray-400 group-hover:text-gray-300'
                                : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDownIcon 
                        className={clsx(
                          "h-4 w-4 transition-transform duration-200",
                          expandedMenus.includes(item.name) ? "transform rotate-180" : ""
                        )} 
                      />
                    </button>
                    
                    {expandedMenus.includes(item.name) && (
                      <div className="mt-1 ml-4 space-y-1 pl-6 border-l border-gray-300 dark:border-gray-700">
                        {item.submenu.map(subitem => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={clsx(
                              "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                              isActive(subitem.href)
                                ? currentTheme === 'dark' 
                                  ? 'bg-gray-700 text-white' 
                                  : 'bg-primary-50 text-primary-700'
                                : currentTheme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <subitem.icon
                              className={clsx(
                                'mr-3 flex-shrink-0 h-4 w-4',
                                isActive(subitem.href) 
                                  ? 'text-primary-500' 
                                  : 'text-gray-400 group-hover:text-gray-500'
                              )}
                            />
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? currentTheme === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-primary-100 text-primary-900'
                        : currentTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={clsx(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive(item.href) 
                          ? 'text-primary-500' 
                          : currentTheme === 'dark'
                            ? 'text-gray-400 group-hover:text-gray-300'
                            : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Theme toggle for mobile */}
          <div className={clsx(
            "p-4 flex items-center border-t",
            currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <button
              onClick={toggleTheme}
              className={clsx(
                "flex items-center justify-center w-full py-2 px-4 rounded-md text-sm font-medium",
                currentTheme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              {currentTheme === 'light' ? (
                <>
                  <MoonIcon className="h-5 w-5 mr-2" />
                  Switch to Dark Mode
                </>
              ) : (
                <>
                  <SunIcon className="h-5 w-5 mr-2" />
                  Switch to Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:w-64">
        <div className={clsx(
          "flex flex-col flex-1 min-h-0 transition-colors duration-200",
          currentTheme === 'dark' 
            ? 'bg-gray-800 border-r border-gray-700' 
            : 'bg-white border-r border-gray-200'
        )}>
          {/* Logo */}
          <div className={clsx(
            "flex items-center h-16 px-4 border-b",
            currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className={clsx(
              "ml-3 text-xl font-semibold",
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>LeadFlowX</span>
          </div>

          {/* Search */}
          <div className="px-4 pt-4 pb-2">
            <div className={clsx(
              "relative rounded-md",
              currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  "block w-full pl-10 pr-3 py-2 rounded-md text-sm border-0 focus:ring-2 focus:ring-primary-500",
                  currentTheme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder:text-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'
                )}
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div className="mb-2">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={clsx(
                        "w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(item.href)
                          ? currentTheme === 'dark' 
                            ? 'bg-gray-700 text-white' 
                            : 'bg-primary-50 text-primary-900'
                          : currentTheme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={clsx(
                            'mr-3 flex-shrink-0 h-5 w-5',
                            isActive(item.href) 
                              ? 'text-primary-500' 
                              : currentTheme === 'dark'
                                ? 'text-gray-400 group-hover:text-gray-300'
                                : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDownIcon 
                        className={clsx(
                          "h-4 w-4 transition-transform duration-200",
                          expandedMenus.includes(item.name) ? "transform rotate-180" : ""
                        )} 
                      />
                    </button>
                    
                    {expandedMenus.includes(item.name) && (
                      <div className="mt-1 ml-4 space-y-1 pl-6 border-l border-gray-300 dark:border-gray-700">
                        {item.submenu.map(subitem => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={clsx(
                              "group flex items-center px-2 py-1.5 text-sm font-medium rounded-md",
                              isActive(subitem.href)
                                ? currentTheme === 'dark' 
                                  ? 'bg-gray-700 text-white' 
                                  : 'bg-primary-50 text-primary-700'
                                : currentTheme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                          >
                            <subitem.icon
                              className={clsx(
                                'mr-3 flex-shrink-0 h-4 w-4',
                                isActive(subitem.href) 
                                  ? 'text-primary-500' 
                                  : 'text-gray-400 group-hover:text-gray-500'
                              )}
                            />
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? currentTheme === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-primary-50 text-primary-900'
                        : currentTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive(item.href) 
                          ? 'text-primary-500' 
                          : currentTheme === 'dark'
                            ? 'text-gray-400 group-hover:text-gray-300'
                            : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Version info */}
          <div className={clsx(
            "p-4 text-xs",
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            LeadFlowX Enterprise v2.4.0
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation bar */}
        <header className={clsx(
          "sticky top-0 z-30 flex h-16 items-center transition-colors duration-200 shadow-sm",
          currentTheme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        )}>
          <div className="flex-1 flex px-4 items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className={clsx(
                "lg:hidden p-2 rounded-md",
                currentTheme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Breadcrumbs - shown on desktop */}
            <div className="hidden sm:flex items-center">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div>
                      <Link 
                        href="/dashboard"
                        className={clsx(
                          "text-sm font-medium",
                          currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        )}
                      >
                        Dashboard
                      </Link>
                    </div>
                  </li>
                  {router.pathname !== '/dashboard' && router.pathname !== '/' && (
                    <>
                      <li>
                        <div className="flex items-center">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span 
                            className={clsx(
                              "ml-2 text-sm font-medium capitalize",
                              currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            )}
                          >
                            {router.pathname.split('/')[1]}
                          </span>
                        </div>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>

            {/* Right side navigation items */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={clsx(
                  "p-2 rounded-full",
                  currentTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                )}
                aria-label={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {currentTheme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>

              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setUserMenuOpen(false);
                  }}
                  className={clsx(
                    "p-2 rounded-full relative",
                    currentTheme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                  )}
                </button>

                {notificationOpen && (
                  <div className={clsx(
                    "origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50",
                    currentTheme === 'dark' ? 'bg-gray-800 ring-1 ring-black ring-opacity-5' : 'bg-white ring-1 ring-black ring-opacity-5'
                  )}>
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className={clsx(
                        "text-sm font-semibold",
                        currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      )}>Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={clsx(
                              "px-4 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700",
                              notification.read 
                                ? currentTheme === 'dark' ? 'opacity-75' : '' 
                                : currentTheme === 'dark' ? 'bg-gray-700' : 'bg-primary-50'
                            )}
                          >
                            <div className="flex-shrink-0 pt-0.5">
                              <div className={clsx(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                notification.read 
                                  ? "bg-gray-200 dark:bg-gray-600" 
                                  : "bg-primary-100 dark:bg-primary-700"
                              )}>
                                <BellIcon className={clsx(
                                  "h-5 w-5",
                                  notification.read 
                                    ? "text-gray-500 dark:text-gray-400" 
                                    : "text-primary-600 dark:text-primary-400"
                                )} />
                              </div>
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className={clsx(
                                "text-sm font-medium",
                                currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                              )}>
                                {notification.text}
                              </p>
                              <p className={clsx(
                                "mt-1 text-xs",
                                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              )}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                      <Link
                        href="#all-notifications"
                        className={clsx(
                          "block text-xs font-medium text-center",
                          currentTheme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                        )}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationOpen(false);
                  }}
                  className={clsx(
                    "flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    currentTheme === 'dark' ? 'focus:ring-offset-gray-800' : ''
                  )}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className={clsx(
                    "h-8 w-8 rounded-full overflow-hidden flex items-center justify-center",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  )}>
                    <UserCircleIcon className="h-7 w-7 text-gray-400" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className={clsx(
                    "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50",
                    currentTheme === 'dark' ? 'bg-gray-800 ring-1 ring-black ring-opacity-5' : 'bg-white ring-1 ring-black ring-opacity-5'
                  )}>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className={clsx(
                        "text-sm font-medium",
                        currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      )}>
                        Jane Doe
                      </p>
                      <p className={clsx(
                        "text-xs truncate",
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        jane.doe@example.com
                      </p>
                    </div>
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          "block px-4 py-2 text-sm",
                          currentTheme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
