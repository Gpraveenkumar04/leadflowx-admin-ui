import React from 'react';
import { render } from '@testing-library/react';
import MetricCard from '../MetricCard';
import { UsersIcon } from '@heroicons/react/24/outline';

describe('MetricCard Component', () => {
  it('renders correctly with props', () => {
    const { getByText } = render(
      <MetricCard
        title="Total Raw Leads"
        value={1000}
        change={{ value: 10, type: 'increase' }}
        icon={UsersIcon}
        color="bg-blue-500"
      />
    );

    expect(getByText('Total Raw Leads')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('10%')).toBeInTheDocument();
  });

  it('handles decrease change correctly', () => {
    const { getByText } = render(
      <MetricCard
        title="QA Queue"
        value={50}
        change={{ value: 5, type: 'decrease' }}
        icon={UsersIcon}
        color="bg-yellow-500"
      />
    );

    expect(getByText('QA Queue')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('5%')).toBeInTheDocument();
  });
});
