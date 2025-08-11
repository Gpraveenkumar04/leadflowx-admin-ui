import React, { useState } from 'react';
import {
  CodeBracketIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';

export default function ScraperWorkersPage() {
  const router = useRouter();
  interface ScraperRow { id: number; name: string; status: 'running' | 'paused' | 'error' | 'idle'; lastRun: string; leadsScraped: number; avgRuntime: string; }
  const [scrapers, setScrapers] = useState<ScraperRow[]>([
    { id: 1, name: 'Google Maps Scraper', status: 'running', lastRun: '10 minutes ago', leadsScraped: 1254, avgRuntime: '45m' },
    { id: 2, name: 'LinkedIn Scraper', status: 'paused', lastRun: '2 hours ago', leadsScraped: 872, avgRuntime: '32m' },
    { id: 3, name: 'Facebook Scraper', status: 'error', lastRun: '1 day ago', leadsScraped: 156, avgRuntime: '15m' },
    { id: 4, name: 'Yelp Scraper', status: 'running', lastRun: '30 minutes ago', leadsScraped: 689, avgRuntime: '28m' },
    { id: 5, name: 'Yellow Pages Scraper', status: 'idle', lastRun: '5 days ago', leadsScraped: 1021, avgRuntime: '50m' },
  ]);
  
  const handleStatusChange = (scraperId: number, newStatus: ScraperRow['status']) => {
    setScrapers(scrapers.map(scraper => 
      scraper.id === scraperId ? {...scraper, status: newStatus} : scraper
    ));
  };
  
  const getStatusBadgeClass = (status: ScraperRow['status']) => {
    switch(status) {
      case 'running': return 'badge-success';
      case 'paused': return 'badge-warning';
      case 'error': return 'badge-danger';
      case 'idle': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };
  
  const getStatusIcon = (status: ScraperRow['status']) => {
    switch(status) {
      case 'running': return <PlayCircleIcon className="h-5 w-5 text-[var(--color-success-500)]" />;
      case 'paused': return <PauseCircleIcon className="h-5 w-5 text-[var(--color-warning-500)]" />;
      case 'error': return <ExclamationCircleIcon className="h-5 w-5 text-[var(--color-danger-500)]" />;
      case 'idle': return <ClockIcon className="h-5 w-5 text-[var(--color-text-muted)]" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Scraper Workers
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Manage and monitor all scraper workers in the system.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => alert('Add new scraper worker')}
            >
              Add Worker
            </button>
          </div>
        </div>
        
        {/* Scraper Workers Table */}
        <div className="card overflow-hidden">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Scraper Name</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Last Run</th>
                <th className="table-header-cell">Leads Scraped</th>
                <th className="table-header-cell">Avg Runtime</th>
                <th className="table-header-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {scrapers.map((scraper) => (
                <tr key={scraper.id} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <CodeBracketIcon className="h-5 w-5 text-[var(--color-text-subtle)] mr-3" />
                      <span className="font-medium text-[var(--color-text)]">{scraper.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={clsx('badge', getStatusBadgeClass(scraper.status))}>
                      {getStatusIcon(scraper.status)}
                      <span className="ml-1.5 capitalize">{scraper.status}</span>
                    </span>
                  </td>
                  <td className="table-cell text-[var(--color-text-muted)]">
                    {scraper.lastRun}
                  </td>
                  <td className="table-cell text-[var(--color-text-muted)]">
                    {scraper.leadsScraped.toLocaleString()}
                  </td>
                  <td className="table-cell text-[var(--color-text-muted)]">
                    {scraper.avgRuntime}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end space-x-4">
                      {scraper.status === 'running' ? (
                        <button
                          type="button"
                          className="text-[var(--color-warning-500)] hover:text-[var(--color-warning-600)] font-medium"
                          onClick={() => handleStatusChange(scraper.id, 'paused')}
                        >
                          Pause
                        </button>
                      ) : scraper.status === 'paused' || scraper.status === 'idle' || scraper.status === 'error' ? (
                        <button
                          type="button"
                          className="text-[var(--color-success-500)] hover:text-[var(--color-success-600)] font-medium"
                          onClick={() => handleStatusChange(scraper.id, 'running')}
                        >
                          Start
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
                        onClick={() => router.push(`/scraper-workers/${scraper.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
