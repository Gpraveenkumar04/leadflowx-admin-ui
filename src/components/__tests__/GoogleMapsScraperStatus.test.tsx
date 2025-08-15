import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleMapsScraperStatus from '../../../components/scrapers/GoogleMapsScraperStatus';
import api from '../../../lib/api';

jest.mock('../../../lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('GoogleMapsScraperStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders status and start button', async () => {
    mockedApi.get.mockImplementation((url: string) => {
      if (url.includes('/status')) {
        return Promise.resolve({ data: { isRunning: false, totalLeads: 5, qualifiedLeads: 2, lastUpdate: null } });
      }
      if (url.includes('/leads')) {
        return Promise.resolve({ data: { leads: [] } });
      }
      return Promise.resolve({ data: {} });
    });

    render(<GoogleMapsScraperStatus />);

    await waitFor(() => expect(screen.getByText(/Total Leads/i)).toBeInTheDocument());
    expect(screen.getByText('5')).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /Start scraper/i });
    expect(startButton).toBeInTheDocument();

    mockedApi.post.mockResolvedValueOnce({ data: { success: true } });
    fireEvent.click(startButton);

    await waitFor(() => expect(mockedApi.post).toHaveBeenCalledWith('/api/scrapers/google-maps/start', expect.any(Object)));
  });
});
