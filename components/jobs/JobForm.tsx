import React from 'react';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DataSource, DATA_SOURCES } from '@/types';
import { t } from '../../src/i18n';
import { Modal, Form, FormInput, FormSelect, FormTextarea, createFormSchema } from '@/design-system/components';

// Form Schema
const jobFormSchema = createFormSchema(z.object({
  name: z.string().min(1, 'Job name is required').max(100, 'Job name must be less than 100 characters'),
  source: z.enum(['google_maps', 'linkedin', 'yelp', 'facebook'] as const),
  filters: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, 'Filters must be valid JSON'),
  cron: z.string().min(1, 'Cron expression is required'),
  concurrency: z.number().min(1, 'Concurrency must be at least 1').max(20, 'Concurrency must be at most 20'),
}));

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
  loading?: boolean;
}

export default function JobForm({ isOpen, onClose, onSubmit, initialData, loading = false }: JobFormProps) {
  const defaultValues: JobFormData = {
    name: initialData?.name || '',
    source: initialData?.source || 'google_maps',
    filters: initialData?.filters || JSON.stringify({
      category: 'restaurant',
      location: 'New York',
      radius: 5000
    }, null, 2),
    cron: initialData?.cron || '0 */2 * * *',
    concurrency: initialData?.concurrency || 5,
  };

  const sourceOptions = DATA_SOURCES.map(src => ({
    value: src,
    label: src.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const handleSubmit = (data: JobFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-medium text-[var(--color-text)]">
            {initialData ? 'Edit Job' : 'Create Job'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="card-body">
          <Form
            schema={jobFormSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel={initialData ? 'Update Job' : 'Create Job'}
            loading={loading}
          >
            <FormInput
              name="name"
              label="Job Name"
              description="A descriptive name for this scraping job"
              required
              placeholder="e.g., NYC Restaurants Scraper"
            />

            <FormSelect
              name="source"
              label="Data Source"
              description="Select the platform to scrape data from"
              required
              options={sourceOptions}
            />

            <FormTextarea
              name="filters"
              label="Filters (JSON)"
              description="Define search criteria and filters in JSON format"
              required
              placeholder={`{
  "category": "restaurant",
  "location": "New York",
  "radius": 5000
}`}
              rows={8}
            />

            <FormInput
              name="cron"
              label="Schedule (Cron Expression)"
              description="Define when this job should run using cron syntax"
              required
              placeholder="0 */2 * * *"
            />

            <FormInput
              name="concurrency"
              label="Concurrency"
              description="Number of parallel workers (1-20)"
              required
              type="number"
              min={1}
              max={20}
            />
          </Form>
        </div>
      </div>
    </Modal>
  );
}
