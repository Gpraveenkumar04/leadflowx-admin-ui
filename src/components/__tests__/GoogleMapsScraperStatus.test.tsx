import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import '@testing-library/jest-dom';
// shared mock for react-hot-toast (must load before components that import toast)
import '../../test/utils/mockReactHotToast';
import GoogleMapsScraperStatus from '../../../components/scrapers/GoogleMapsScraperStatus';
import { scrapersAPI } from '../../../src/services/api';

jest.mock('../../../src/services/api', () => ({
  scrapersAPI: {
    getGoogleMapsStatus: jest.fn(),
    getGoogleMapsLeads: jest.fn(),
    startGoogleMaps: jest.fn(),
    stopGoogleMaps: jest.fn(),
    exportGoogleMaps: jest.fn(),
  }
}));

// -> moved to shared mock at src/test/utils/mockReactHotToast.ts

const mockedScrapers = scrapersAPI as unknown as {
  getGoogleMapsStatus: jest.Mock;
  getGoogleMapsLeads: jest.Mock;
  startGoogleMaps: jest.Mock;
  stopGoogleMaps: jest.Mock;
  exportGoogleMaps: jest.Mock;
};

describe('GoogleMapsScraperStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders status and start button', async () => {
  mockedScrapers.getGoogleMapsStatus.mockResolvedValue({ isRunning: false, totalLeads: 5, qualifiedLeads: 2, lastUpdate: null, runningTime: null });
  mockedScrapers.getGoogleMapsLeads.mockResolvedValue([]);

    render(<GoogleMapsScraperStatus />);

    await waitFor(() => expect(screen.getByText(/Total Leads/i)).toBeInTheDocument());
    expect(screen.getByText('5')).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /Start scraper/i });
    expect(startButton).toBeInTheDocument();

  mockedScrapers.startGoogleMaps.mockResolvedValueOnce(undefined);
  fireEvent.click(startButton);

  await waitFor(() => expect(mockedScrapers.startGoogleMaps).toHaveBeenCalledWith(expect.objectContaining({ maxQualifiedLeads: expect.any(Number) })));
  });

  it('disables buttons while pending and shows toasts on success/failure', async () => {
    // first status fetch: stopped; after start, status should report running
    mockedScrapers.getGoogleMapsStatus
      .mockResolvedValueOnce({ isRunning: false, totalLeads: 0, qualifiedLeads: 0, lastUpdate: null, runningTime: null })
      .mockResolvedValueOnce({ isRunning: true, totalLeads: 0, qualifiedLeads: 0, lastUpdate: null, runningTime: '00:00:10' });
    mockedScrapers.getGoogleMapsLeads.mockResolvedValue([]);

  // get mocked toast from shared helper
  const { toast } = require('../../test/utils/mockReactHotToast');
    // start will take a moment; simulate by returning a promise that resolves after a tick
    let resolveStart: () => void;
    const startPromise = new Promise<void>((res) => { resolveStart = res; });
    mockedScrapers.startGoogleMaps.mockReturnValueOnce(startPromise as any).mockResolvedValueOnce(undefined);

    const { rerender } = render(<GoogleMapsScraperStatus />);
    await waitFor(() => expect(mockedScrapers.getGoogleMapsStatus).toHaveBeenCalled());

  const startBtn = screen.getByRole('button', { name: /Start scraper/i });
  expect(startBtn).toBeEnabled();
  // click to start (use userEvent to ensure act wrappers)
    // wrap in act to avoid React act(...) warning for state updates inside event handlers
    await act(async () => {
      await userEvent.click(startBtn);
    });
  // after click, the start button should be disabled because statusText becomes 'starting'
  await waitFor(() => expect(startBtn).toBeDisabled());

    // resolve the start
  resolveStart!();
  // wait for the start call to settle and for success toast to be called
  await waitFor(() => expect(mockedScrapers.startGoogleMaps).toHaveBeenCalled());

  // Now simulate stop failure and toast error
  mockedScrapers.stopGoogleMaps.mockRejectedValueOnce(new Error('stop-fail'));
  const stopBtn = screen.getByRole('button', { name: /Stop scraper/i });
    await act(async () => {
      await userEvent.click(stopBtn);
    });

  // dialog should appear; find confirm button in dialog and click it
  const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
  // silence expected console.error from the failure path and assert it was called
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => {
    await userEvent.click(confirmButton);
  });

  await waitFor(() => expect(mockedScrapers.stopGoogleMaps).toHaveBeenCalled());
  // assert toasts were called
  await waitFor(() => expect(toast.success).toHaveBeenCalled());
  await waitFor(() => expect(toast.error).toHaveBeenCalled());

  expect(consoleErrorSpy).toHaveBeenCalled();
  consoleErrorSpy.mockRestore();
  });

  it('keeps Start disabled when status is running from API', async () => {
    mockedScrapers.getGoogleMapsStatus.mockResolvedValue({ isRunning: true, totalLeads: 10, qualifiedLeads: 5, lastUpdate: null, runningTime: '00:10:00' });
    mockedScrapers.getGoogleMapsLeads.mockResolvedValue([]);

    render(<GoogleMapsScraperStatus />);
    // wait for status fetch
    await waitFor(() => expect(mockedScrapers.getGoogleMapsStatus).toHaveBeenCalled());
    const startBtn = screen.getByRole('button', { name: /Start scraper/i });
    expect(startBtn).toBeDisabled();
  });
});
