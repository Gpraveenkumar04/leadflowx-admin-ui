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
import ScraperWorkersTable from '../components/scrapers/ScraperWorkersTable';
import { t } from '../src/i18n';
import { Modal, Input, Button } from '@/design-system/components';
import { scrapersAPI } from '@/services/api';
import { notify } from '@/design-system/components';

export default function ScraperWorkersPage() {
  const router = useRouter();
  // Workers table is extracted to a component and consumes the real scrapers API
  const [showAdd, setShowAdd] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [creating, setCreating] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function createWorker(name: string) {
    const trimmed = name.trim();
    // Basic client-side validation: non-empty and allowed chars
    if (!trimmed) {
      setNameError(t('scrapers.add_modal.invalid_name'));
      return;
    }
    if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
      setNameError(t('scrapers.add_modal.invalid_name'));
      return;
    }

    setNameError(null);
    setCreating(true);
    try {
      await scrapersAPI.createWorker(trimmed);
      notify.success(t('scrapers.toast.created'));
      setShowAdd(false);
      setNewWorkerName('');
      router.replace(router.asPath);
    } catch (e) {
      console.error('Failed to create worker', e);
      notify.error(t('scrapers.toast.create_failed'));
    } finally {
      setCreating(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    createWorker(newWorkerName);
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              {t('scrapers.header') || 'Scraper Workers'}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {t('scrapers.subheader') || 'Manage and monitor all scraper workers in the system.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAdd(true)}
              >
              {t('actions.create')}
            </button>
          </div>
        </div>
        
  <ScraperWorkersTable />

      {/* Add Worker Modal */}
      <Modal open={showAdd} onClose={() => !creating && setShowAdd(false)} title={t('scrapers.add_modal.title')} size="sm" footer={
        <div className="flex justify-end space-x-2">
          <button className="btn" onClick={() => !creating && setShowAdd(false)}>{t('actions.cancel')}</button>
          <button type="submit" form="add-worker-form" className="btn btn-primary" disabled={!newWorkerName.trim() || creating}>{creating ? t('actions.creating') : t('scrapers.add_modal.confirm')}</button>
        </div>
      }>
        <form id="add-worker-form" onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">{t('scrapers.add_modal.desc')}</p>
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('scrapers.add_modal.name_label')}</label>
          <Input autoFocus value={newWorkerName} onChange={e => setNewWorkerName(e.target.value)} placeholder={t('scrapers.add_modal.name_placeholder')} aria-invalid={!!nameError} />
          {nameError && <p className="text-xs text-danger-600">{nameError}</p>}
        </form>
      </Modal>
      </div>
    </Layout>
  );
}
