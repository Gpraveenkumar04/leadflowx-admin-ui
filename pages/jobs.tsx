import React, { useState, useEffect } from 'react';
import { 
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import { jobsAPI } from '../src/services/api';
import { ScrapingJob, JobStatus, DataSource, DATA_SOURCES } from '../src/types';
import { clsx } from 'clsx';
import { useTheme } from '../src/design-system/ThemeProvider';

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

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    try {
      JSON.parse(formData.filters);
    } catch (e) {
      newErrors.filters = 'Invalid JSON format';
    }
    
    if (formData.concurrency < 1 || formData.concurrency > 20) {
      newErrors.concurrency = 'Concurrency must be between 1 and 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        <div className="relative inline-block w-full max-w-lg transform text-left align-middle transition-all">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--color-text)]">
                {initialData ? 'Edit Job' : 'Create New Job'}
              </h3>
              <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Job Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input mt-1"
                  placeholder="e.g., NYC Restaurants Scraper"
                />
                {errors.name && <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Data Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as DataSource }))}
                  className="select mt-1"
                >
                  {DATA_SOURCES.map(source => (
                    <option key={source} value={source}>
                      {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Filters (JSON)</label>
                <textarea
                  value={formData.filters}
                  onChange={(e) => setFormData(prev => ({ ...prev, filters: e.target.value }))}
                  rows={6}
                  className="input mt-1 font-mono text-sm"
                  placeholder='{"category": "restaurant", "location": "New York"}'
                />
                {errors.filters && <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.filters}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Cron Schedule</label>
                <input
                  type="text"
                  value={formData.cron}
                  onChange={(e) => setFormData(prev => ({ ...prev, cron: e.target.value }))}
                  className="input mt-1 font-mono"
                  placeholder="0 */2 * * *"
                />
                <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                  Current: Every 2 hours. Use{' '}
                  <a href="https://crontab.guru" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-500)] hover:underline">
                    crontab.guru
                  </a>{' '}
                  to help build your schedule.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Concurrency</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.concurrency}
                  onChange={(e) => setFormData(prev => ({ ...prev, concurrency: parseInt(e.target.value) || 1 }))}
                  className="input mt-1"
                />
                {errors.concurrency && <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.concurrency}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {initialData ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobName: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ isOpen, onClose, jobId, jobName }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, jobId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const jobLogs = await jobsAPI.getJobLogs(jobId, 500);
      setLogs(jobLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        <div className="relative inline-block w-full max-w-4xl transform text-left align-middle transition-all">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--color-text)]">
                Logs - {jobName}
              </h3>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary-500)]"></div>
                )}
                <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="bg-[var(--color-bg-inset)] text-[var(--color-text-muted)] font-mono text-sm p-4 rounded-lg max-h-[60vh] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center py-4">No logs available</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap break-words">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<ScrapingJob | null>(null);
  const [showLogs, setShowLogs] = useState<{ jobId: string; jobName: string } | null>(null);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await jobsAPI.getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (data: JobFormData) => {
    try {
      const newJob = await jobsAPI.createJob({
        name: data.name,
        source: data.source,
        filters: JSON.parse(data.filters),
        cron: data.cron,
        concurrency: data.concurrency,
        status: 'paused'
      });
      setJobs(prev => [...prev, newJob]);
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleUpdateJob = async (data: JobFormData) => {
    if (!editingJob) return;
    
    try {
      const updatedJob = await jobsAPI.updateJob(editingJob.id, {
        name: data.name,
        source: data.source,
        filters: JSON.parse(data.filters),
        cron: data.cron,
        concurrency: data.concurrency
      });
      setJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
      setEditingJob(null);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleStartJob = async (jobId: string) => {
    try {
      await jobsAPI.startJob(jobId);
      await fetchJobs();
    } catch (error) {
      console.error('Failed to start job:', error);
    }
  };

  const handlePauseJob = async (jobId: string) => {
    try {
      await jobsAPI.pauseJob(jobId);
      await fetchJobs();
    } catch (error) {
      console.error('Failed to pause job:', error);
    }
  };

  const handleStopJob = async (jobId: string) => {
    try {
      await jobsAPI.stopJob(jobId);
      await fetchJobs();
    } catch (error) {
      console.error('Failed to stop job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    
    try {
      await jobsAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleCloneJob = async (job: ScrapingJob) => {
    const newName = prompt('Enter name for cloned job:', `${job.name} (Copy)`);
    if (!newName) return;

    try {
      const clonedJob = await jobsAPI.cloneJob(job.id, newName);
      setJobs(prev => [...prev, clonedJob]);
    } catch (error) {
      console.error('Failed to clone job:', error);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'running':
        return <span className="badge badge-success animate-pulse">Running</span>;
      case 'paused':
        return <span className="badge badge-warning">Paused</span>;
      case 'failed':
        return <span className="badge badge-danger">Failed</span>;
      case 'completed':
        return <span className="badge badge-primary">Completed</span>;
      default:
        return <span className="badge badge-secondary">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-bg-subtle)] rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-[var(--color-bg-subtle)] rounded-lg"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Scraping Jobs
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Manage and monitor your scraping workflows
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => { setEditingJob(null); setShowJobForm(true); }}
              className="btn btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Job
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="card flex flex-col">
              <div className="card-body flex-grow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-[var(--color-text)] truncate">{job.name}</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Source: <span className="font-medium text-[var(--color-text)]">{job.source.replace(/_/g, ' ')}</span>
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Schedule: <span className="font-mono text-xs text-[var(--color-text)] bg-[var(--color-bg-subtle)] px-1 py-0.5 rounded">{job.cron}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(job.status)}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-[var(--color-text-muted)]">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    <span>Concurrency: {job.concurrency}</span>
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Last updated: {new Date(job.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="card-footer bg-[var(--color-bg-subtle)] flex justify-between items-center">
                  <div className="flex space-x-2">
                    {job.status === 'running' ? (
                      <>
                        <button
                          onClick={() => handlePauseJob(job.id)}
                          className="btn btn-warning btn-sm"
                          title="Pause job"
                        >
                          <PauseIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStopJob(job.id)}
                          className="btn btn-danger btn-sm"
                          title="Stop job"
                        >
                          <StopIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartJob(job.id)}
                        className="btn btn-success btn-sm"
                        title="Start job"
                      >
                        <PlayIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowLogs({ jobId: job.id, jobName: job.name })}
                      className="btn btn-secondary btn-sm"
                      title="View logs"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingJob(job); setShowJobForm(true); }}
                      className="btn btn-secondary btn-sm"
                      title="Edit job"
                    >
                      <CogIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCloneJob(job)}
                      className="btn btn-secondary btn-sm"
                      title="Clone job"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn btn-danger btn-sm"
                      title="Delete job"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12 card">
            <div className="card-body">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-[var(--color-text-subtle)]" />
              <h3 className="mt-2 text-sm font-medium text-[var(--color-text)]">No jobs found</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Get started by creating a new scraping job.</p>
              <div className="mt-6">
                <button
                  onClick={() => { setEditingJob(null); setShowJobForm(true); }}
                  className="btn btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create New Job
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        <JobForm
          isOpen={showJobForm}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
          initialData={editingJob ? {
            name: editingJob.name,
            source: editingJob.source as DataSource,
            filters: JSON.stringify(editingJob.filters, null, 2),
            cron: editingJob.cron,
            concurrency: editingJob.concurrency
          } : undefined}
        />

        {/* Log Viewer Modal */}
        {showLogs && (
          <LogViewer
            isOpen={true}
            onClose={() => setShowLogs(null)}
            jobId={showLogs.jobId}
            jobName={showLogs.jobName}
          />
        )}
      </div>
    </Layout>
  );
}
