import React from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import PageHeader from '../../../components/ui/PageHeader';
import GoogleMapsScraperStatus from '../../../components/scrapers/GoogleMapsScraperStatus';

const GoogleMapsScraper: React.FC = () => {
  return (
    <AdminLayout>
      <PageHeader title="Google Maps Lead Scraper" subtitle="Configure and monitor Google Maps lead generation" />

      <div className="mt-6">
        <GoogleMapsScraperStatus />
      </div>

      <section className="mt-6 card">
        <div className="card-body">
          <h4 className="text-lg font-semibold mb-2">Configuration</h4>
          <p className="text-sm text-[var(--color-text-muted)]">Advanced configuration is available via the scraper worker tooling. Use the controls above to run and manage scraper runs.</p>
        </div>
      </section>
    </AdminLayout>
  );
};

export default GoogleMapsScraper;
