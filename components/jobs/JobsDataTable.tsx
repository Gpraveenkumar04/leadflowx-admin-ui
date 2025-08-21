import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PlayIcon, PauseIcon, StopIcon, EyeIcon, CogIcon, DocumentDuplicateIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ScrapingJob, JobStatus } from '@/types';
import { t } from '@/i18n';
import { DataTable, createSortableColumn, createStatusColumn, Badge, Button } from '@/design-system/components';

interface JobsDataTableProps {
  jobs: ScrapingJob[];
  onStartJob: (jobId: string) => void;
  onPauseJob: (jobId: string) => void;
  onStopJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onEditJob: (job: ScrapingJob) => void;
  onCloneJob: (job: ScrapingJob) => void;
  onViewLogs: (jobId: string, jobName: string) => void;
  loading?: boolean;
}

const jobStatusMap = {
  running: { label: t('jobs.status.running'), variant: 'success' as const },
  paused: { label: t('jobs.status.paused'), variant: 'warning' as const },
  failed: { label: t('jobs.status.failed'), variant: 'danger' as const },
  completed: { label: t('jobs.status.completed'), variant: 'secondary' as const },
};

export function JobsDataTable({
  jobs,
  onStartJob,
  onPauseJob,
  onStopJob,
  onDeleteJob,
  onEditJob,
  onCloneJob,
  onViewLogs,
  loading = false,
}: JobsDataTableProps) {
  const columns: ColumnDef<ScrapingJob>[] = [
    createSortableColumn('name', t('jobs.field.name'), (value) => (
      <div className="text-sm font-medium text-[var(--color-text)]">{value}</div>
    )),
    
    createSortableColumn('source', t('jobs.field.source'), (value) => (
      <Badge variant="primary">{value?.replace(/_/g, ' ')}</Badge>
    )),
    
    createSortableColumn('cron', t('jobs.field.schedule'), (value) => (
      <code className="text-xs bg-[var(--color-bg-subtle)] px-2 py-1 rounded font-mono text-[var(--color-text)]">
        {value}
      </code>
    )),
    
    createSortableColumn('concurrency', t('jobs.field.concurrency'), (value) => (
      <div className="flex items-center text-sm text-[var(--color-text-muted)]">
        <ClockIcon className="h-4 w-4 mr-1.5" />
        <span>{value}</span>
      </div>
    )),
    
    createStatusColumn('status', t('jobs.field.status'), jobStatusMap),
    
    createSortableColumn('updatedAt', t('jobs.last_updated'), (value) => (
      <div className="text-sm text-[var(--color-text-muted)]">
        {new Date(value as string).toLocaleString()}
      </div>
    )),
    
    {
      accessorKey: 'actions',
      header: t('jobs.field.actions'),
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex items-center space-x-1">
            {job.status === 'running' ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPauseJob(job.id)}
                  className="h-8 w-8 p-0"
                  title={t('jobs.tooltip.pause')}
                >
                  <PauseIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStopJob(job.id)}
                  className="h-8 w-8 p-0"
                  title={t('jobs.tooltip.stop')}
                >
                  <StopIcon className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartJob(job.id)}
                className="h-8 w-8 p-0"
                title={t('jobs.tooltip.start')}
              >
                <PlayIcon className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewLogs(job.id, job.name)}
              className="h-8 w-8 p-0"
              title={t('jobs.tooltip.view_logs')}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditJob(job)}
              className="h-8 w-8 p-0"
              title={t('jobs.tooltip.edit')}
            >
              <CogIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCloneJob(job)}
              className="h-8 w-8 p-0"
              title={t('jobs.tooltip.clone')}
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteJob(job.id)}
              className="h-8 w-8 p-0 text-[var(--color-danger-500)] hover:text-[var(--color-danger-600)]"
              title={t('jobs.tooltip.delete')}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={jobs}
      loading={loading}
      searchable={true}
      filterable={true}
      className="w-full"
    />
  );
}
