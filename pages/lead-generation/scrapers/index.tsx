import React from 'react';
import { useRouter } from 'next/router';

import AdminLayout from '../../../components/layouts/AdminLayout';
import PageHeader from '../../../components/ui/PageHeader';

type ScraperItem = {
  title: string;
  description: string;
  path: string;
  isNew?: boolean;
};

interface ScraperCardProps {
  title: string;
  description: string;
  path: string;
  isNew?: boolean;
}

const ScraperCard: React.FC<ScraperCardProps> = ({ title, description, path, isNew = false }) => {
  const router = useRouter();

  return (
    <div
      className="p-5 card cursor-pointer"
      onClick={() => router.push(path)}
    >
      {isNew && (
        <div className="absolute top-0 right-0 py-1 px-2 text-xs font-bold bg-[var(--color-bg-accent-subtle)] text-[var(--color-accent-500)]">NEW</div>
      )}
      <div className="mb-4 text-3xl">🔎</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
};

const ScrapersIndex: React.FC = () => {
  const router = useRouter();

  const scrapers: ScraperItem[] = [
    {
      title: 'Google Maps Scraper',
      description: 'Find businesses without websites on Google Maps',
      path: '/lead-generation/scrapers/google-maps',
      isNew: true
    },
    {
      title: 'Yelp Scraper',
      description: 'Extract business information from Yelp',
      path: '/lead-generation/scrapers/yelp'
    },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Lead Generation Scrapers" subtitle="Configure and manage lead generation scrapers" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {scrapers.map((scraper, index) => (
          <ScraperCard key={index} title={scraper.title} description={scraper.description} path={scraper.path} isNew={scraper.isNew} />
        ))}

        <div className="p-5 card border-dashed cursor-pointer flex flex-col items-center justify-center opacity-70 hover:opacity-100" onClick={() => router.push('/lead-generation/scrapers/new')}>
          <div className="mb-4 text-3xl">＋</div>
          <h3 className="text-lg font-semibold mb-2">Add New Scraper</h3>
          <p className="text-sm text-center text-[var(--color-text-muted)]">Configure a new lead generation source</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ScrapersIndex;
