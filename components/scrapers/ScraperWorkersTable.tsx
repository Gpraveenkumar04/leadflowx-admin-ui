import React, { useEffect, useState } from 'react';
import { scrapersAPI } from '@/services/api';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import { t } from '@/i18n';

export default function ScraperWorkersTable() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkers();
    const t = setInterval(fetchWorkers, 10000);
    return () => clearInterval(t);
  }, []);

  async function fetchWorkers() {
    try {
      setLoading(true);
      const data = await scrapersAPI.getWorkers();
      setWorkers(data);
  setError(null);
    } catch (e) {
  console.error('Failed to load workers', e);
  setError(t('scrapers.load_failed'));
    } finally {
      setLoading(false);
    }
  }

  const handleStart = async (name: string) => {
    try {
      await scrapersAPI.startWorker(name);
      await fetchWorkers();
  } catch (e) { console.error(e); setError(t('scrapers.start_failed')); }
  };

  const handleStop = async (name: string) => {
    try {
      await scrapersAPI.stopWorker(name);
      await fetchWorkers();
  } catch (e) { console.error(e); setError(t('scrapers.stop_failed')); }
  };

  if (loading) return <div className="card">{t('scrapers.loading')}</div>;

  return (
    <div className="card overflow-hidden">
      {error && <div className="p-3 text-sm text-[var(--color-danger-700)]">{error}</div>}
      <table className="table w-full">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell">Last Run</th>
            <th className="table-header-cell">Leads</th>
            <th className="table-header-cell">Avg Runtime</th>
            <th className="table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {workers.map(w => (
            <tr key={w.name} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
              <td className="table-cell"><div className="font-medium text-[var(--color-text)]">{w.name}</div></td>
              <td className="table-cell text-[var(--color-text-muted)]"><Badge variant={w.status === 'running' ? 'success' : w.status === 'paused' ? 'warning' : w.status === 'error' ? 'danger' : 'secondary'}>{w.status}</Badge></td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.lastRun || '—'}</td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.leadsScraped?.toLocaleString() ?? '—'}</td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.avgRuntime ?? '—'}</td>
              <td className="table-cell text-right">
                <div className="flex items-center justify-end space-x-4">
                  {w.status === 'running' ? (
                    <button aria-label={t('scrapers.action.stop', { name: w.name })} className="text-[var(--color-warning-500)]" onClick={() => handleStop(w.name)}>
                      <PauseCircleIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button aria-label={t('scrapers.action.start', { name: w.name })} className="text-[var(--color-success-500)]" onClick={() => handleStart(w.name)}>
                      <PlayCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
