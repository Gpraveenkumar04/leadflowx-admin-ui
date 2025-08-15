import React from 'react';
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

export default function ScraperWorkersPage() {
  const router = useRouter();
  // Workers table is extracted to a component and consumes the real scrapers API

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
              onClick={() => alert('Add new scraper worker')}
            >
              Add Worker
            </button>
          </div>
        </div>
        
  <ScraperWorkersTable />
      </div>
    </Layout>
  );
}
