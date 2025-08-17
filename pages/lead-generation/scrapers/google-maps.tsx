import React from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import PageHeader from '../../../components/ui/PageHeader';
import GoogleMapsScraperStatus from '../../../components/scrapers/GoogleMapsScraperStatus';
import { t } from '../../../src/i18n';

const GoogleMapsScraper: React.FC = () => {
  return (
    <AdminLayout>
      <PageHeader title={t('scrapers.google_maps.title')} subtitle={t('scrapers.google_maps.subtitle')} />

      <div className="mt-6">
        <GoogleMapsScraperStatus />
      </div>

      <section className="mt-6 card">
        <div className="card-body">
          <h4 className="text-lg font-semibold mb-2">{t('scrapers.configuration.title')}</h4>
          <p className="text-sm text-[var(--color-text-muted)]">{t('scrapers.configuration.desc')}</p>
        </div>
      </section>
    </AdminLayout>
  );
};

export default GoogleMapsScraper;
