import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import { scrapersAPI } from '@/services/api';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

export default function WorkerDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [worker, setWorker] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchWorker();
    fetchLogs();
    const t = setInterval(fetchWorker, 10000);
    return () => clearInterval(t);
  }, [id]);

  async function fetchWorker() {
    try {
      const w = await scrapersAPI.getWorker(String(id));
      setWorker(w);
    } catch (e) { console.error(e); }
  }

  async function fetchLogs() {
    try {
      const l = await scrapersAPI.getWorkerLogs(String(id), 200);
      setLogs(l);
    } catch (e) { console.error(e); }
  }

  const handleStart = async () => { if (!worker) return; await scrapersAPI.startWorker(worker.name); fetchWorker(); };
  const handleStop = async () => { if (!worker) return; await scrapersAPI.stopWorker(worker.name); fetchWorker(); };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{worker?.name ?? 'Worker'}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Status: {worker?.status ?? '—'}</p>
          </div>
          <div className="flex items-center space-x-2">
            {worker?.status === 'running' ? (
              <button className="btn btn-warning" onClick={handleStop}><PauseIcon className="h-4 w-4"/></button>
            ) : (
              <button className="btn btn-success" onClick={handleStart}><PlayIcon className="h-4 w-4"/></button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="text-sm font-medium">Recent Logs</h3></div>
          <div className="card-body bg-[var(--color-bg-inset)] font-mono text-sm max-h-[50vh] overflow-y-auto">
            {logs.length === 0 ? <div className="p-4 text-[var(--color-text-muted)]">No logs</div> : logs.map((l,i)=>(<div key={i} className="p-2 whitespace-pre-wrap">{l}</div>))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
