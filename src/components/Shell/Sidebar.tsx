import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import NavItem from './NavItem';
import SidebarGroup from './SidebarGroup';
import { t } from '../../i18n';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  submenu?: NavigationItem[];
}

interface SidebarProps {
  navigation: NavigationItem[];
  collapsed: boolean;
  toggleCollapse: () => void;
  expandedMenus: string[];
  toggleMenu: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  setSidebarOpen: (open: boolean) => void;
  density: 'comfortable' | 'compact';
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  collapsed,
  toggleCollapse,
  expandedMenus,
  toggleMenu,
  searchQuery,
  setSearchQuery,
  setSidebarOpen,
  density
}) => {
  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className={clsx(
          'fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out',
          'translate-x-0'
        )}>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-900 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold text-lg">
                  L
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  LeadFlowX
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  className={clsx(
                    'w-full rounded-lg pl-10 pr-4 py-2 text-sm',
                    'bg-gray-50 dark:bg-gray-800',
                    'border border-gray-200 dark:border-gray-700',
                    'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                  placeholder={t('shell.search.short')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              {filteredNavigation.map((item) => (
                <div key={item.name} className="py-0.5">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={clsx(
                          'w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200',
                          'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                          'hover:bg-gray-100 dark:hover:bg-gray-800',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                        )}
                        aria-expanded={expandedMenus.includes(item.name)}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto flex-shrink-0 py-0.5 px-2 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <ChevronDownIcon
                          className={clsx(
                            'h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                            expandedMenus.includes(item.name) && 'rotate-180'
                          )}
                        />
                      </button>
                      {expandedMenus.includes(item.name) && (
                        <div className="mt-1 ml-4 pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
                          {item.submenu.map((subItem) => (
                            <NavItem
                              key={subItem.name}
                              href={subItem.href}
                              icon={subItem.icon}
                              label={subItem.name}
                              onClick={() => setSidebarOpen(false)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavItem
                      href={item.href}
                      icon={item.icon}
                      label={item.name}
                      badge={item.badge}
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>LeadFlowX v2.4.0</span>
                <span className="ml-auto uppercase tracking-wide font-medium">
                  {density === 'compact' ? 'Cm' : 'Cf'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={clsx(
        'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'lg:w-20' : 'lg:w-64'
      )}>
        <div className="flex flex-1 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white font-semibold text-lg">
                L
              </div>
              {!collapsed && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  LeadFlowX
                </span>
              )}
            </div>
            <button
              onClick={toggleCollapse}
              className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <ChevronDownIcon className={clsx('h-5 w-5 transition-transform duration-200', collapsed ? 'rotate-90' : '-rotate-90')} />
            </button>
          </div>

          {/* Search - Only show when expanded */}
          {!collapsed && (
            <div className="px-4 py-3">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  className={clsx(
                    'w-full rounded-lg pl-10 pr-4 py-2 text-sm',
                    'bg-gray-50 dark:bg-gray-800',
                    'border border-gray-200 dark:border-gray-700',
                    'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                  placeholder={t('shell.search.long')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <div key={item.name} className="py-0.5">
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={clsx(
                        'w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200',
                        'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                      )}
                      aria-expanded={expandedMenus.includes(item.name)}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <item.icon className="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        {!collapsed && (
                          <span className="font-medium truncate">{item.name}</span>
                        )}
                        {item.badge && !collapsed && (
                          <span className="ml-auto flex-shrink-0 py-0.5 px-2 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {!collapsed && (
                        <ChevronDownIcon
                          className={clsx(
                            'h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                            expandedMenus.includes(item.name) && 'rotate-180'
                          )}
                        />
                      )}
                    </button>
                    {expandedMenus.includes(item.name) && !collapsed && (
                      <div className="mt-1 ml-4 pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
                        {item.submenu.map((subItem) => (
                          <NavItem
                            key={subItem.name}
                            href={subItem.href}
                            icon={subItem.icon}
                            label={subItem.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavItem
                    href={item.href}
                    icon={item.icon}
                    label={item.name}
                    badge={item.badge}
                    collapsed={collapsed}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              {!collapsed && <span>LeadFlowX v2.4.0</span>}
              <span className="ml-auto uppercase tracking-wide font-medium">
                {density === 'compact' ? 'Cm' : 'Cf'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
