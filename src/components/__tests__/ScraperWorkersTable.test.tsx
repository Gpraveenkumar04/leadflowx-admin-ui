import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ScraperWorkersTable from '../../../components/scrapers/ScraperWorkersTable';
import * as api from '../../../src/services/api';

jest.mock('../../../src/services/api');

describe('ScraperWorkersTable', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders workers and handles start/stop', async () => {
    const mockWorkers = [
      { name: 'google-maps', status: 'running', lastRun: '1m', leadsScraped: 10, avgRuntime: '5m' },
      { name: 'yelp', status: 'paused', lastRun: '10m', leadsScraped: 5, avgRuntime: '2m' }
    ];

    (api.scrapersAPI.getWorkers as jest.Mock).mockResolvedValue(mockWorkers);
    (api.scrapersAPI.stopWorker as jest.Mock).mockResolvedValue(undefined);
    (api.scrapersAPI.startWorker as jest.Mock).mockResolvedValue(undefined);

    render(<ScraperWorkersTable />);

    await waitFor(() => expect(api.scrapersAPI.getWorkers).toHaveBeenCalled());

    expect(screen.getByText('google-maps')).toBeInTheDocument();
    expect(screen.getByText('yelp')).toBeInTheDocument();

    // click stop on google-maps
    const stopButtons = screen.getAllByRole('button');
    fireEvent.click(stopButtons[0]);
    await waitFor(() => expect(api.scrapersAPI.stopWorker).toHaveBeenCalledWith('google-maps'));
  });

  it('shows error when workers fetch fails and when actions fail', async () => {
    (api.scrapersAPI.getWorkers as jest.Mock).mockRejectedValue(new Error('network')); 
    render(<ScraperWorkersTable />);
    await waitFor(() => expect(api.scrapersAPI.getWorkers).toHaveBeenCalled());
    expect(await screen.findByText(/Failed to load workers/i)).toBeInTheDocument();

    // Now mock workers but action fails
    const mockWorkers = [ { name: 'google-maps', status: 'paused', lastRun: '1m', leadsScraped: 3, avgRuntime: '3m' } ];
    (api.scrapersAPI.getWorkers as jest.Mock).mockResolvedValueOnce(mockWorkers);
    (api.scrapersAPI.startWorker as jest.Mock).mockRejectedValue(new Error('start-fail'));

    render(<ScraperWorkersTable />);
    await waitFor(() => expect(api.scrapersAPI.getWorkers).toHaveBeenCalled());
    const startBtn = screen.getAllByRole('button')[0];
    startBtn.click();
    await waitFor(() => expect(api.scrapersAPI.startWorker).toHaveBeenCalledWith('google-maps'));
    expect(await screen.findByText(/Failed to start scraper/i)).toBeInTheDocument();
  });
});
