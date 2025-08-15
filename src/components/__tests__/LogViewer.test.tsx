import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LogViewer from '../../../components/jobs/LogViewer';
import * as api from '../../../src/services/api';

jest.mock('../../../src/services/api');

describe('LogViewer', () => {
  beforeEach(() => jest.resetAllMocks());

  it('fetches and shows logs when open', async () => {
    (api.jobsAPI.getJobLogs as jest.Mock).mockResolvedValue(['line1','line2']);

    render(<LogViewer isOpen={true} onClose={() => {}} jobId={'1'} jobName={'Job'} />);

    await waitFor(() => expect(api.jobsAPI.getJobLogs).toHaveBeenCalledWith('1', 500));
    expect(screen.getByText('line1')).toBeInTheDocument();
  });
});
