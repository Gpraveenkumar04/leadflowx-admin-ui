import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import JobDetailPage from '../../../../pages/jobs/[id]';
import * as jobsApi from '../../../../src/services/api';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

jest.mock('../../../../src/services/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('react-hot-toast', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('JobDetailPage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('starts, pauses, and stops job with toasts and disables buttons while pending', async () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: 'job-1' } });

    const job = { id: 'job-1', name: 'Test Job', source: 'google_maps', status: 'paused', cron: '*/5 * * * *', concurrency: 1 };
    (jobsApi.jobsAPI.getJob as jest.Mock).mockResolvedValue(job);
    (jobsApi.jobsAPI.startJob as jest.Mock).mockResolvedValue(undefined);
    (jobsApi.jobsAPI.pauseJob as jest.Mock).mockResolvedValue(undefined);
    (jobsApi.jobsAPI.stopJob as jest.Mock).mockResolvedValue(undefined);

    render(<JobDetailPage />);
    await waitFor(() => expect(jobsApi.jobsAPI.getJob).toHaveBeenCalledWith('job-1'));

    // Start button should be present (job paused)
    const startBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.startJob).toHaveBeenCalledWith('job-1'));
    expect(toast.success).toHaveBeenCalled();

    // Pause
    (jobsApi.jobsAPI.getJob as jest.Mock).mockResolvedValue({ ...job, status: 'running' });
    // Re-rendering flow: simulate a running job
    const pauseBtn = await screen.findByRole('button', { name: /pause/i });
    fireEvent.click(pauseBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.pauseJob).toHaveBeenCalledWith('job-1'));
    expect(toast.success).toHaveBeenCalled();

    // Stop (confirm will be called, but JSDOM confirm is undefined; we can mock window.confirm)
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const stopBtn = screen.getByRole('button', { name: /stop/i });
    fireEvent.click(stopBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.stopJob).toHaveBeenCalledWith('job-1'));
    expect(toast.success).toHaveBeenCalled();
  });
});
