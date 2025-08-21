import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PlayIcon, PauseIcon, StopIcon, EyeIcon, CogIcon, DocumentDuplicateIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ScrapingJob, JobStatus } from '@/types';
import { t } from '@/i18n';
import { Badge, Button } from '@/components/ui/Form/Form';

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
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<ScrapingJob>[]>(() => [
    {
      accessorKey: 'name',
      header: t('jobs.field.name'),
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {row.original.name}
        </div>
      ),
      sortingFn: 'alphanumeric'
    },
    {
      accessorKey: 'source',
      header: t('jobs.field.source'),
      cell: ({ row }) => (
        <Badge 
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        >
          {row.original.source?.replace(/_/g, ' ')}
        </Badge>
      ),
      sortingFn: 'alphanumeric'
    },
    {
      accessorKey: 'cron',
      header: t('jobs.field.schedule'),
      cell: ({ row }) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {row.original.cron}
        </code>
      )
    },
    {
      accessorKey: 'concurrency',
      header: t('jobs.field.concurrency'),
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <ClockIcon className="mr-1.5 h-4 w-4" />
          <span>{row.original.concurrency}</span>
        </div>
      ),
      sortingFn: 'number'
    },
    {
      accessorKey: 'status',
      header: t('jobs.field.status'),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={
              status === 'running'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : status === 'paused'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : status === 'failed'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }
          >
            {jobStatusMap[status].label}
          </Badge>
        );
      },
      sortingFn: 'alphanumeric'
    },
    {
      accessorKey: 'updatedAt',
      header: t('jobs.last_updated'),
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(row.original.updatedAt).toLocaleString()}
        </div>
      ),
      sortingFn: 'datetime'
    },
    
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

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const parentRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-4 w-1/4 bg-gray-200 rounded dark:bg-gray-800" />
                <div className="h-4 w-1/6 bg-gray-200 rounded dark:bg-gray-800" />
                <div className="h-4 w-1/5 bg-gray-200 rounded dark:bg-gray-800" />
                <div className="h-4 w-1/6 bg-gray-200 rounded dark:bg-gray-800" />
                <div className="h-4 w-1/4 bg-gray-200 rounded dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-hidden">
        <div ref={parentRef} className="max-h-[600px] overflow-auto">
          <table className="w-full min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className="relative"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-4 text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
