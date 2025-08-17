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

export const Sidebar: React.FC<SidebarProps> = ({ navigation, collapsed, toggleCollapse, expandedMenus, toggleMenu, searchQuery, setSearchQuery, setSidebarOpen, density }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <div className={clsx('fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden', 'translate-x-0')}> {/* mobile visibility controlled by parent */}
        <div className="h-full flex flex-col bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)] shadow-xl">
          <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 radius-md bg-[var(--color-accent-600)] flex items-center justify-center text-[var(--color-accent-text-contrast)] font-semibold">L</div>
              <span className="text-base font-semibold text-[var(--color-text-primary)]">LeadFlowX</span>
            </div>
            <button onClick={()=> setSidebarOpen(false)} aria-label="Close sidebar" className="p-2 radius-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"><XMarkIcon className="h-5 w-5" /></button>
          </div>
          <div className="p-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={t('shell.search.short')} className="w-full pl-9 pr-3 h-9 radius-md bg-[var(--color-bg-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]" />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Mobile primary">
            <SidebarGroup>
              {navigation.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                item.submenu ? (
                  <div key={item.name} className="mb-1">
                    <button onClick={()=>toggleMenu(item.name)} className={clsx('w-full flex items-center justify-between h-9 px-2 text-sm radius-md group transition-colors', 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]')} aria-expanded={expandedMenus.includes(item.name)} aria-controls={`m-sub-${item.name}`}>
                        <span className="flex items-center gap-2"><item.icon className={clsx('h-4 w-4 text-[var(--color-text-muted)]')} /> {item.name} {item.badge && <span className="ml-1 text-[10px] radius-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}</span>
                      <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', expandedMenus.includes(item.name) && 'rotate-180')} />
                    </button>
                    <div id={`m-sub-${item.name}`} className={clsx('pl-4 mt-1 space-y-1 border-l border-[var(--color-border-subtle)]', !expandedMenus.includes(item.name) && 'hidden')}>
                      {item.submenu.map(sub => (
                        <NavItem key={sub.name} href={sub.href} icon={sub.icon} label={sub.name} onClick={()=> setSidebarOpen(false)} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={item.name} className="mb-1">
                    <NavItem href={item.href} icon={item.icon} label={item.name} onClick={()=> setSidebarOpen(false)} />
                  </div>
                )
              ))}
            </SidebarGroup>
          </nav>
          <div className="p-3 border-t border-[var(--color-border-subtle)] flex gap-2">
            <button className="flex-1 h-9 radius-md text-xs font-medium bg-[var(--color-bg-muted)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{density === 'comfortable' ? t('shell.view.compact') : t('shell.view.comfort')}</button>
            <button className="flex-1 h-9 radius-md text-xs font-medium bg-[var(--color-bg-muted)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]">{t('shell.theme')}</button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={clsx('hidden lg:flex lg:flex-col lg:inset-y-0 lg:fixed transition-[width] duration-300', collapsed ? 'lg:w-16 w-16' : 'lg:w-64 w-64')}>
        <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)]">
          <div className="flex items-center h-14 px-3 border-b border-[var(--color-border-subtle)] gap-3">
            <div className="h-9 w-9 radius-md bg-[var(--color-accent-600)] flex items-center justify-center text-[var(--color-accent-text-contrast)] font-semibold">L</div>
            {!collapsed && <span className="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight">LeadFlowX</span>}
            <button onClick={toggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="ml-auto p-2 radius-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]">
              {collapsed ? <ChevronDownIcon className="h-4 w-4 rotate-90" /> : <ChevronDownIcon className="h-4 w-4 -rotate-90" />}
            </button>
          </div>
          <div className="px-3 pt-3 pb-2 hidden xl:block">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={t('shell.search.long')} className="w-full h-9 pl-9 pr-3 radius-md bg-[var(--color-bg-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]" />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Primary navigation">
            <SidebarGroup>
              {navigation.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                item.submenu ? (
                  <div key={item.name} className="mb-1">
                    <button onClick={()=>toggleMenu(item.name)} aria-expanded={expandedMenus.includes(item.name)} aria-controls={`sub-${item.name}`} className={clsx('group w-full flex items-center justify-between radius-md h-9 px-2 text-sm font-medium transition-colors', 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]')}> 
                      <span className="flex items-center gap-2 min-w-0">
                        <item.icon className={clsx('h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]')} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                        {item.badge && !collapsed && <span className="ml-1 text-[10px] radius-full px-1.5 py-0.5 bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]">{item.badge}</span>}
                      </span>
                      {!collapsed && <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', expandedMenus.includes(item.name) && 'rotate-180')} />}
                    </button>
                    <div id={`sub-${item.name}`} className={clsx('mt-1 space-y-1 pl-6 border-l border-[var(--color-border-subtle)]', (!expandedMenus.includes(item.name) || collapsed) && 'hidden')}>
                      {item.submenu.map(sub => (
                        <NavItem key={sub.name} href={sub.href} icon={sub.icon} label={sub.name} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div key={item.name} className="mb-1">
                    <NavItem href={item.href} icon={item.icon} label={item.name} collapsed={collapsed} badge={item.badge} />
                  </div>
                )
              ))}
            </SidebarGroup>
          </nav>
          <div className="p-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
            {!collapsed && <span>LeadFlowX Enterprise v2.4.0</span>}
            <span className="ml-auto uppercase tracking-wide">{density === 'compact' ? 'Cm' : 'Cf'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
