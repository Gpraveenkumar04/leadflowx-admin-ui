import React, { useEffect, useState } from 'react';
import { scrapersAPI } from '@/services/api';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import { t } from '@/i18n';

// Generate a stable, DOM-safe id for a worker name.
// We avoid using the raw name because it may contain spaces or invalid id characters.
function stableId(name: string) {
  // djb2-like hash to produce a stable, small value
  let h = 5381;
  for (let i = 0; i < name.length; i++) {
    h = (h * 33) ^ name.charCodeAt(i);
  }
  // Ensure positive and use base36 for shorter id
  const hash = (h >>> 0).toString(36);
  return `worker-name-${hash}`;
}

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
            <th className="table-header-cell">{t('scrapers.table.name') || 'Name'}</th>
            <th className="table-header-cell">{t('scrapers.table.status') || 'Status'}</th>
            <th className="table-header-cell">{t('scrapers.table.last_run') || 'Last Run'}</th>
            <th className="table-header-cell">{t('scrapers.table.leads') || 'Leads'}</th>
            <th className="table-header-cell">{t('scrapers.table.avg_runtime') || 'Avg Runtime'}</th>
            <th className="table-header-cell text-right">{t('scrapers.table.actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {workers.map(w => (
            <tr key={w.name} className="hover:bg-[var(--color-bg-subtle)] transition-colors">
              <td className="table-cell"><div className="font-medium text-[var(--color-text)]">{w.name}</div></td>
              <td className="table-cell text-[var(--color-text-muted)]"><Badge variant={w.status === 'running' ? 'success' : w.status === 'paused' ? 'warning' : w.status === 'error' ? 'danger' : 'secondary'}>{t(`scrapers.status.${w.status}`) || w.status}</Badge></td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.lastRun || '—'}</td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.leadsScraped?.toLocaleString() ?? '—'}</td>
              <td className="table-cell text-[var(--color-text-muted)]">{w.avgRuntime ?? '—'}</td>
              <td className="table-cell text-right">
                <div className="flex items-center justify-end space-x-4">
                  {/* Visually hidden label for screen readers that includes the worker name */}
                  <span id={stableId(w.name)} className="sr-only">{t('scrapers.worker_name_sr', { name: w.name })}</span>
                  {w.status === 'running' ? (
                    <button aria-label={t('scrapers.action.stop_generic')} aria-describedby={stableId(w.name)} className="text-[var(--color-warning-500)]" onClick={() => handleStop(w.name)}>
                      <PauseCircleIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button aria-label={t('scrapers.action.start_generic')} aria-describedby={stableId(w.name)} className="text-[var(--color-success-500)]" onClick={() => handleStart(w.name)}>
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
