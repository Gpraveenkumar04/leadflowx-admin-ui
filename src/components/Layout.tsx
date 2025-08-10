import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, UsersIcon, BriefcaseIcon, CheckCircleIcon, CogIcon, ChartBarIcon, CodeBracketIcon, Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon, MoonIcon, SunIcon, MagnifyingGlassIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../design-system/ThemeProvider';
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
  const { theme: currentTheme, toggle: toggleTheme, density, toggleDensity } = useTheme();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('lfx-sidebar-collapsed') === '1'; } catch { return false; }
  });
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

  // remove internal theme management (handled by ThemeProvider)

  const toggleCollapse = () => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('lfx-sidebar-collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
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
  <div className={clsx('min-h-screen bg-[var(--color-bg-app)] text-[var(--color-text-primary)] antialiased')}>
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar (redesigned) */}
      <div className={clsx('fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="h-full flex flex-col bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)] shadow-xl">
          <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-md bg-[var(--color-accent-600)] flex items-center justify-center text-[var(--color-accent-text-contrast)] font-semibold">L</div>
              <span className="text-base font-semibold text-[var(--color-text-primary)]">LeadFlowX</span>
            </div>
            <button onClick={()=> setSidebarOpen(false)} aria-label="Close sidebar" className="p-2 rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"><XMarkIcon className="h-5 w-5" /></button>
          </div>
          <div className="p-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search" className="w-full pl-9 pr-3 h-9 rounded-md bg-[var(--color-bg-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]" />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Mobile primary">
            {navigation.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
              <div key={item.name} className="mb-1">
                {item.submenu ? (
                  <>
                    <button onClick={()=>toggleMenu(item.name)} className={clsx('w-full flex items-center justify-between h-9 px-2 text-sm rounded-md group transition-colors', isActive(item.href) ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]')} aria-expanded={expandedMenus.includes(item.name)} aria-controls={`m-sub-${item.name}`}> 
                      <span className="flex items-center gap-2"><item.icon className={clsx('h-4 w-4', isActive(item.href) ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} /> {item.name} {item.badge && <span className="ml-1 text-[10px] rounded-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}</span>
                      <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', expandedMenus.includes(item.name) && 'rotate-180')} />
                    </button>
                    <div id={`m-sub-${item.name}`} className={clsx('pl-4 mt-1 space-y-1 border-l border-[var(--color-border-subtle)]', !expandedMenus.includes(item.name) && 'hidden')}>
                      {item.submenu.map(sub => (
                        <Link key={sub.name} href={sub.href} onClick={()=> setSidebarOpen(false)} className={clsx('flex items-center gap-2 h-8 pl-2 pr-2 rounded-md text-xs transition-colors', isActive(sub.href) ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}>
                          <sub.icon className={clsx('h-4 w-4', isActive(sub.href) ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} /> {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href} onClick={()=> setSidebarOpen(false)} className={clsx('flex items-center gap-2 h-9 px-2 rounded-md text-sm transition-colors', isActive(item.href) ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}>
                    <item.icon className={clsx('h-4 w-4', isActive(item.href) ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} /> {item.name}
                    {item.badge && <span className="ml-auto text-[10px] rounded-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-[var(--color-border-subtle)] flex gap-2">
            <button onClick={toggleTheme} className="flex-1 h-9 rounded-md text-xs font-medium bg-[var(--color-bg-muted)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{currentTheme === 'light' ? 'Dark' : 'Light'}</button>
            <button onClick={toggleDensity} className="flex-1 h-9 rounded-md text-xs font-medium bg-[var(--color-bg-muted)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{density === 'comfortable' ? 'Compact' : 'Comfort'}</button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar (redesigned) */}
      <div className={clsx('hidden lg:flex lg:flex-col lg:inset-y-0 lg:fixed transition-[width] duration-300', collapsed ? 'lg:w-16 w-16' : 'lg:w-64 w-64')}>
        <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)]">
          <div className="flex items-center h-14 px-3 border-b border-[var(--color-border-subtle)] gap-3">
            <div className="h-9 w-9 rounded-md bg-[var(--color-accent-600)] flex items-center justify-center text-[var(--color-accent-text-contrast)] font-semibold">L</div>
            {!collapsed && <span className="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight">LeadFlowX</span>}
            <button onClick={toggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="ml-auto p-2 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]">
              {collapsed ? <ChevronDownIcon className="h-4 w-4 rotate-90" /> : <ChevronDownIcon className="h-4 w-4 -rotate-90" />}
            </button>
          </div>
          <div className="px-3 pt-3 pb-2 hidden xl:block">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full h-9 pl-9 pr-3 rounded-md bg-[var(--color-bg-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]" />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Primary navigation">
            {navigation.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => {
              const active = isActive(item.href);
              return (
                <div key={item.name} className="mb-1">
                  {item.submenu ? (
                    <>
                      <button onClick={()=>toggleMenu(item.name)} aria-expanded={expandedMenus.includes(item.name)} aria-controls={`sub-${item.name}`} className={clsx('group w-full flex items-center justify-between rounded-md h-9 px-2 text-sm font-medium transition-colors', active ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}> 
                        <span className="flex items-center gap-2 min-w-0">
                          <item.icon className={clsx('h-4 w-4 flex-shrink-0', active ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                          {item.badge && !collapsed && <span className="ml-1 text-[10px] rounded-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}
                        </span>
                        {!collapsed && <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', expandedMenus.includes(item.name) && 'rotate-180')} />}
                      </button>
                      <div id={`sub-${item.name}`} className={clsx('mt-1 space-y-1 pl-6 border-l border-[var(--color-border-subtle)]', (!expandedMenus.includes(item.name) || collapsed) && 'hidden')}>
                        {item.submenu.map(sub => {
                          const subActive = isActive(sub.href);
                          return (
                            <Link key={sub.name} href={sub.href} className={clsx('flex items-center gap-2 h-8 rounded-md pl-2 pr-2 text-xs transition-colors', subActive ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}>
                              <sub.icon className={clsx('h-4 w-4', subActive ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} /> {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} className={clsx('group flex items-center rounded-md h-9 px-2 text-sm font-medium transition-colors', active ? 'bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}>
                      <item.icon className={clsx('h-4 w-4 flex-shrink-0', active ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]')} />
                      {!collapsed && <span className="ml-2 truncate">{item.name}</span>}
                      {item.badge && !collapsed && <span className="ml-auto text-[10px] rounded-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
            {!collapsed && <span>LeadFlowX Enterprise v2.4.0</span>}
            <span className="ml-auto uppercase tracking-wide">{density === 'compact' ? 'Cm' : 'Cf'}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--toolbar-bg-translucent)] bg-[var(--color-bg-elevated)]/90 border-b border-[var(--color-border-subtle)] flex items-center h-14 sm:h-16 shadow-sm transition-colors">
          <div className="flex-1 flex px-3 sm:px-4 items-center gap-2 justify-between">
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

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center text-sm text-[var(--color-text-muted)]" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/dashboard" className="hover:text-[var(--color-text-primary)] font-medium">Dashboard</Link>
                </li>
                {router.pathname !== '/dashboard' && router.pathname !== '/' && (
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-border-soft)]">/</span>
                    <span className="capitalize font-medium text-[var(--color-text-primary)]">{router.pathname.split('/')[1]}</span>
                  </li>
                )}
              </ol>
            </nav>

            {/* Right side navigation items */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Density toggle */}
              <button
                onClick={toggleDensity}
                className="px-2 h-8 inline-flex items-center gap-1 text-xs font-medium rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                aria-label="Toggle density"
                title={`Switch to ${density === 'comfortable' ? 'compact' : 'comfortable'} density`}
              >
                <span className="hidden md:inline">{density === 'comfortable' ? 'Comfort' : 'Compact'}</span>
                <span className="md:hidden">{density === 'comfortable' ? 'C' : 'Cm'}</span>
              </button>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
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
                  className="p-2 rounded-md relative text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[var(--color-status-error)] ring-2 ring-[var(--color-bg-elevated)]" />
                  )}
                </button>

                {notificationOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 z-50 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] backdrop-blur">
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
                              'px-4 py-3 flex items-start rounded-md cursor-pointer',
                              notification.read ? 'hover:bg-[var(--color-bg-hover)] opacity-80' : 'bg-[var(--color-bg-accent-subtle)] hover:bg-[var(--color-bg-accent-muted)]'
                            )}
                          >
                            <div className="flex-shrink-0 pt-0.5">
                              <div className={clsx(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                notification.read 
                                  ? 'bg-[var(--color-bg-muted)]' 
                                  : 'bg-[var(--color-bg-accent)]'
                              )}>
                                <BellIcon className={clsx(
                                  "h-5 w-5",
                                  notification.read 
                                    ? 'text-[var(--color-text-secondary)]' 
                                    : 'text-[var(--color-accent-text-contrast)]'
                                )} />
                              </div>
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className={clsx(
                                "text-sm font-medium",
                                'text-[var(--color-text-primary)]'
                              )}>
                                {notification.text}
                              </p>
                              <p className={clsx(
                                "mt-1 text-xs",
                                'text-[var(--color-text-muted)]'
                              )}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
          <div className="border-t border-[var(--color-border-subtle)] px-4 py-2">
                      <Link
                        href="#all-notifications"
            className="block text-xs font-medium text-center text-[var(--color-accent-600)] hover:text-[var(--color-accent-500)]"
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
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
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
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Jane Doe
                      </p>
                      <p className="text-xs truncate text-[var(--color-text-muted)]">
                        jane.doe@example.com
                      </p>
                    </div>
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
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
