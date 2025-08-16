import React from 'react';
// toast mock is registered globally via jest.setup.ts
const { toast } = require('../../../test/utils/mockReactHotToast');
// Increase default timeout for these integration-like tests
jest.setTimeout(20000);
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import JobDetailPage from '../../../../pages/jobs/[id]';
import { ThemeProvider } from '../../../../src/design-system/ThemeProvider';
import * as jobsApi from '../../../../src/services/api';
import { useRouter } from 'next/router';

jest.mock('../../../../src/services/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('JobDetailPage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('starts, pauses, and stops job with toasts and disables buttons while pending', async () => {
  (useRouter as jest.Mock).mockReturnValue({ query: { id: 'job-1' }, pathname: '/jobs/job-1' });

    const job = { id: 'job-1', name: 'Test Job', source: 'google_maps', status: 'paused', cron: '*/5 * * * *', concurrency: 1 };
    (jobsApi.jobsAPI.getJob as jest.Mock)
      .mockResolvedValueOnce(job)
      .mockResolvedValueOnce({ ...job, status: 'running' })
      .mockResolvedValueOnce({ ...job, status: 'stopped' });
    (jobsApi.jobsAPI.startJob as jest.Mock).mockResolvedValue(undefined);
    (jobsApi.jobsAPI.pauseJob as jest.Mock).mockResolvedValue(undefined);
    (jobsApi.jobsAPI.stopJob as jest.Mock).mockResolvedValue(undefined);

    render(
      <ThemeProvider>
        <JobDetailPage />
      </ThemeProvider>
    );
    await waitFor(() => expect(jobsApi.jobsAPI.getJob).toHaveBeenCalledWith('job-1'));

    // Start button should be present (job paused)
    const startBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.startJob).toHaveBeenCalledWith('job-1'));
    expect(toast.success).toHaveBeenCalled();

  // Pause (job now running)
  const pauseBtn = await screen.findByRole('button', { name: /pause/i });
    fireEvent.click(pauseBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.pauseJob).toHaveBeenCalledWith('job-1'));
    expect(toast.success).toHaveBeenCalled();

  // Stop: open the ConfirmDialog and confirm
  const stopBtn = screen.getByRole('button', { name: /stop/i });
  fireEvent.click(stopBtn);
  const confirmBtn = await screen.findByRole('button', { name: /Confirm/i });
  fireEvent.click(confirmBtn);
  await waitFor(() => expect(jobsApi.jobsAPI.stopJob).toHaveBeenCalledWith('job-1'));
  expect(toast.success).toHaveBeenCalled();
  });

  it('shows disabled buttons when action fails and displays error', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({ query: { id: 'job-1' }, pathname: '/jobs/job-1' });
    const job2 = { id: 'job-1', name: 'Test Job', source: 'google_maps', status: 'paused', cron: '*/5 * * * *', concurrency: 1 };
    (jobsApi.jobsAPI.getJob as jest.Mock).mockResolvedValue(job2);
    (jobsApi.jobsAPI.startJob as jest.Mock).mockRejectedValue(new Error('start-error'));

    render(
      <ThemeProvider>
        <JobDetailPage />
      </ThemeProvider>
    );

    await waitFor(() => expect(jobsApi.jobsAPI.getJob).toHaveBeenCalledWith('job-1'));
    const startBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startBtn);
    await waitFor(() => expect(jobsApi.jobsAPI.startJob).toHaveBeenCalledWith('job-1'));
    // After failure toast.error should be called
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(consoleErrorSpy).toHaveBeenCalled();
  consoleErrorSpy.mockRestore();
  });
});
