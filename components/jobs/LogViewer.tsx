import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { jobsAPI } from '@/services/api';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobName: string;
}

export default function LogViewer({ isOpen, onClose, jobId, jobName }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchLogs();
    const t = setInterval(fetchLogs, 5000);
    return () => clearInterval(t);
  }, [isOpen, jobId]);

  async function fetchLogs() {
    try {
      setLoading(true);
      const jobLogs = await jobsAPI.getJobLogs(jobId, 500);
      setLogs(jobLogs);
    } catch (e) {
      console.error('Failed to fetch logs', e);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden />
        <div className="relative inline-block w-full max-w-4xl transform text-left align-middle transition-all">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--color-text)]">Logs - {jobName}</h3>
              <div className="flex items-center space-x-2">
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary-500)]" />}
                <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"><XMarkIcon className="h-6 w-6" /></button>
              </div>
            </div>
            <div className="card-body">
              <div className="bg-[var(--color-bg-inset)] text-[var(--color-text-muted)] font-mono text-sm p-4 rounded-lg max-h-[60vh] overflow-y-auto">
                {logs.length === 0 ? <div className="text-center py-4">No logs available</div> : logs.map((l, i) => <div key={i} className="whitespace-pre-wrap break-words">{l}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
