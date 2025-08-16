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
import { ScrapingJob, JobStatus, DataSource } from '../src/types';
import { clsx } from 'clsx';
import JobForm from '../components/jobs/JobForm';
import LogViewer from '../components/jobs/LogViewer';
import Badge from '../src/components/ui/Badge';
import { t } from '../src/i18n';
import ConfirmDialog from '../components/ui/ConfirmDialog';

type JobFormData = {
  name: string;
  source: string;
  filters: string;
  cron: string;
  concurrency: number;
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
    // open confirmation dialog
    setPendingDelete(jobId);
  };

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const confirmDeleteJob = async () => {
    if (!pendingDelete) return;
    try {
      await jobsAPI.deleteJob(pendingDelete);
      setJobs(prev => prev.filter(job => job.id !== pendingDelete));
    } catch (error) {
      console.error('Failed to delete job:', error);
    } finally {
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => setPendingDelete(null);

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
        return <Badge variant="success">{t('jobs.status.running') || 'Running'}</Badge>;
      case 'paused':
        return <Badge variant="warning">{t('jobs.status.paused') || 'Paused'}</Badge>;
      case 'failed':
        return <Badge variant="danger">{t('jobs.status.failed') || 'Failed'}</Badge>;
      case 'completed':
        return <Badge variant="secondary">{t('jobs.status.completed') || 'Completed'}</Badge>;
      default:
        return <Badge variant="secondary">{t('jobs.status.unknown') || 'Unknown'}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-bg-subtle)] rounded w-1/4">{t('jobs.loading')}</div>
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

        <ConfirmDialog
          open={!!pendingDelete}
          title="Confirm"
          message={"Are you sure you want to delete this job? This action cannot be undone."}
          onConfirm={confirmDeleteJob}
          onCancel={cancelDelete}
        />

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
