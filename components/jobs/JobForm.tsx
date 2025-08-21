import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DATA_SOURCES } from '@/types';
import { t } from '../../src/i18n';
import { jobSchema } from '@/lib/schemas';
import { useZodForm, FormField, Input, Select, Textarea } from '@/components/ui/Form/Form';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
  loading?: boolean;
}

export default function JobForm({ isOpen, onClose, onSubmit, initialData, loading = false }: JobFormProps) {
  const form = useZodForm(jobSchema, {
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'scraping',
      schedule: initialData?.schedule || '0 */2 * * *',
      active: initialData?.active ?? true,
      priority: initialData?.priority || 3,
      config: initialData?.config || {
        source: 'google_maps',
        filters: {
          category: 'restaurant',
          location: 'New York',
          radius: 5000
        }
      }
    }
  });

  const onFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onClose();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {initialData ? 'Edit Job' : 'Create Job'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onFormSubmit} className="mt-4 space-y-6">
          <FormField
            label="Job Name"
            error={form.formState.errors.name?.message}
            required
          >
            <Input
              {...form.register('name')}
              placeholder="e.g., NYC Restaurants Scraper"
              error={!!form.formState.errors.name}
            />
          </FormField>

          <FormField
            label="Job Type"
            error={form.formState.errors.type?.message}
            required
          >
            <Select
              {...form.register('type')}
              error={!!form.formState.errors.type}
            >
              <option value="scraping">Scraping</option>
              <option value="processing">Processing</option>
              <option value="scoring">Scoring</option>
            </Select>
          </FormField>

          <FormField
            label="Schedule"
            error={form.formState.errors.schedule?.message}
            description="Cron expression for job scheduling"
            required
          >
            <Input
              {...form.register('schedule')}
              placeholder="0 */2 * * *"
              error={!!form.formState.errors.schedule}
            />
          </FormField>

          <FormField
            label="Priority"
            error={form.formState.errors.priority?.message}
            description="Job priority (1-5, higher is more important)"
          >
            <Select
              {...form.register('priority', { valueAsNumber: true })}
              error={!!form.formState.errors.priority}
            >
              {[1, 2, 3, 4, 5].map(p => (
                <option key={p} value={p}>
                  {p} - {p === 1 ? 'Lowest' : p === 5 ? 'Highest' : 'Normal'}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Configuration"
            error={form.formState.errors.config?.message}
            description="Job-specific configuration in JSON format"
          >
            <Textarea
              {...form.register('config')}
              rows={8}
              placeholder={JSON.stringify({
                source: 'google_maps',
                filters: {
                  category: 'restaurant',
                  location: 'New York',
                  radius: 5000
                }
              }, null, 2)}
              error={!!form.formState.errors.config}
              className="font-mono"
            />
          </FormField>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{initialData ? 'Update Job' : 'Create Job'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
