import React, { useEffect, useState } from 'react';
import Layout from '../../src/components/Layout';
import { useRouter } from 'next/router';
import { jobsAPI } from '../../src/services/api';
import Badge from '../../src/components/ui/Badge';
import LogViewer from '../../components/jobs/LogViewer';
import { t } from '../../src/i18n';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id]);

  async function fetchJob() {
    try {
      setLoading(true);
      const j = await jobsAPI.getJob(id as string);
      setJob(j);
      setError(null);
    } catch (e) {
      console.error('Failed to load job', e);
      setError(t('jobs.load_failed') || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }

  const handleStart = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await jobsAPI.startJob(job.id);
      await fetchJob();
      setError(null);
      toast.success(t('jobs.toast.started') || 'Job started');
    } catch (e) {
      console.error('Failed to start job', e);
      setError(t('jobs.start_failed') || 'Failed to start job');
      toast.error(t('jobs.toast.start_failed') || 'Failed to start job');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await jobsAPI.pauseJob(job.id);
      await fetchJob();
      setError(null);
      toast.success(t('jobs.toast.paused') || 'Job paused');
    } catch (e) {
      console.error('Failed to pause job', e);
      setError(t('jobs.pause_failed') || 'Failed to pause job');
      toast.error(t('jobs.toast.pause_failed') || 'Failed to pause job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!job) return;
    // open confirm dialog
    setShowConfirm(true);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmStop = async () => {
    setShowConfirm(false);
    if (!job) return;
    setActionLoading(true);
    try {
      await jobsAPI.stopJob(job.id);
      await fetchJob();
      setError(null);
      toast.success(t('jobs.toast.stopped') || 'Job stopped');
    } catch (e) {
      console.error('Failed to stop job', e);
      setError(t('jobs.stop_failed') || 'Failed to stop job');
      toast.error(t('jobs.toast.stop_failed') || 'Failed to stop job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelStop = () => setShowConfirm(false);

  if (loading) return <Layout><div className="card">{t('jobs.loading')}</div></Layout>;
  if (!job) return <Layout><div className="card">{t('jobs.not_found') || 'Job not found'}</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{job.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{job.source}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={job.status === 'running' ? 'success' : job.status === 'paused' ? 'warning' : 'secondary'}>{t(`jobs.status.${job.status}`) || job.status}</Badge>
                <div className="flex space-x-2">
                  {job.status === 'running' ? (
                    <button
                      aria-label={t('jobs.action.pause')}
                      className={"btn btn-warning btn-sm"}
                      onClick={handlePause}
                      disabled={actionLoading}
                      aria-disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                          {t('jobs.action.pause') || 'Pause'}
                        </span>
                      ) : (
                        t('jobs.action.pause') || 'Pause'
                      )}
                    </button>
                  ) : (
                    <button
                      aria-label={t('jobs.action.start')}
                      className={"btn btn-success btn-sm"}
                      onClick={handleStart}
                      disabled={actionLoading}
                      aria-disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                          {t('jobs.action.start') || 'Start'}
                        </span>
                      ) : (
                        t('jobs.action.start') || 'Start'
                      )}
                    </button>
                  )}
                  <button
                    aria-label={t('jobs.action.stop')}
                    className="btn btn-danger btn-sm"
                    onClick={handleStop}
                    disabled={actionLoading}
                    aria-disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                        {t('jobs.action.stop') || 'Stop'}
                      </span>
                    ) : (
                      t('jobs.action.stop') || 'Stop'
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[var(--color-text-muted)]">{t('jobs.field.schedule')}: <span className="font-mono">{job.cron}</span></p>
              <p className="text-sm text-[var(--color-text-muted)]">{t('jobs.field.concurrency')}: {job.concurrency}</p>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div>
                <button className="btn btn-secondary" onClick={() => setShowLogs(true)}>{t('jobs.view_logs') || 'View Logs'}</button>
              </div>
              <div>
                {error && <div className="text-sm text-[var(--color-danger-700)]">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogs && <LogViewer isOpen={true} onClose={() => setShowLogs(false)} jobId={job.id} jobName={job.name} />}
      <ConfirmDialog
        open={showConfirm}
        title={t('confirm.confirm')}
        message={t('jobs.confirm.stop') || 'Stop this job?'}
        onConfirm={handleConfirmStop}
        onCancel={handleCancelStop}
      />
    </Layout>
  );
}
