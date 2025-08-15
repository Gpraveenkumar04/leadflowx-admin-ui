import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, UsersIcon, BriefcaseIcon, CheckCircleIcon, CogIcon, ChartBarIcon, CodeBracketIcon, Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon, MoonIcon, SunIcon, MagnifyingGlassIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../design-system/ThemeProvider';
import { clsx } from 'clsx';
import Topbar from './Shell/Topbar';
import Sidebar from './Shell/Sidebar';
import Notifications from './Shell/Notifications';
import UserMenu from './Shell/UserMenu';

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

function LayoutCore({ children }: LayoutProps) {
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (mobile + desktop) */}
      <Sidebar
        navigation={navigation}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        searchQuery={searchQuery}
        setSearchQuery={(s) => setSearchQuery(s)}
        setSidebarOpen={(s) => setSidebarOpen(s)}
        density={density}
      />

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <Topbar
          setSidebarOpen={(s) => setSidebarOpen(s)}
          currentTheme={currentTheme}
          toggleDensity={toggleDensity}
          density={density}
          toggleTheme={toggleTheme}
          notificationOpen={notificationOpen}
          setNotificationOpen={(n) => setNotificationOpen(n)}
          notifications={notifications}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={(n) => setUserMenuOpen(n)}
          routerPath={router.pathname}
        />

        {/* Notification dropdown and user menu remain in LayoutCore to keep stateful markup centralized */}
  <Notifications notifications={notifications} open={notificationOpen} currentTheme={currentTheme} />
  <UserMenu open={userMenuOpen} userNavigation={userNavigation} />

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

// Keep default export small to allow importing Shell instead when evolving the redesign.
export default function Layout({ children }: LayoutProps) {
  return <LayoutCore>{children}</LayoutCore>;
}

export { LayoutCore };
