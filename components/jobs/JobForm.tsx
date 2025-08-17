import React, { useState } from 'react';
import { t } from '../../src/i18n';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DataSource, DATA_SOURCES } from '@/types';

interface JobFormData {
  name: string;
  source: DataSource;
  filters: string;
  cron: string;
  concurrency: number;
}

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
}

export default function JobForm({ isOpen, onClose, onSubmit, initialData }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    name: initialData?.name || '',
    source: initialData?.source || 'google_maps',
    filters: initialData?.filters || '{\n  "category": "restaurant",\n  "location": "New York",\n  "radius": 5000\n}',
    cron: initialData?.cron || '0 */2 * * *',
    concurrency: initialData?.concurrency || 5
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    try { JSON.parse(formData.filters); } catch (e) { newErrors.filters = 'Invalid JSON'; }
    if (formData.concurrency < 1 || formData.concurrency > 20) newErrors.concurrency = 'Concurrency must be 1-20';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden />
        <div className="relative inline-block w-full max-w-lg transform text-left align-middle transition-all">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--color-text)]">Create / Edit Job</h3>
              <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"><XMarkIcon className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="card-body space-y-4">
              <div>
                <label htmlFor="job-name" className="block text-sm font-medium text-[var(--color-text-muted)]">Job Name</label>
                <input id="job-name" className="input mt-1" value={formData.name} onChange={e => setFormData(prev=>({ ...prev, name: e.target.value }))} />
                {errors.name && <p className="text-[var(--color-danger-500)] text-sm">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="job-source" className="block text-sm font-medium text-[var(--color-text-muted)]">Data Source</label>
                <select id="job-source" className="select mt-1" value={formData.source} onChange={e => setFormData(prev=>({ ...prev, source: e.target.value as DataSource }))}>
                  {DATA_SOURCES.map(src => <option key={src} value={src}>{src.replace(/_/g,' ')}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="job-filters" className="block text-sm font-medium text-[var(--color-text-muted)]">Filters (JSON)</label>
                <textarea id="job-filters" className="input mt-1 font-mono text-sm" rows={6} value={formData.filters} onChange={e => setFormData(prev=>({ ...prev, filters: e.target.value }))} />
                {errors.filters && <p className="text-[var(--color-danger-500)] text-sm">{errors.filters}</p>}
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="btn btn-secondary">{t('actions.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
