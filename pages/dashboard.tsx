import React, { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Layout from '../src/components/Layout';
import { dashboardAPI } from '../src/services/api';
import { DashboardMetrics } from '../src/types';
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import MetricCard from '../src/components/MetricCard';
import { useTheme } from '../src/design-system/ThemeProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Define schema for anomaly detection
const AnomalySchema = z.object({
  metric: z.string(),
  value: z.number(),
  anomaly: z.boolean(),
});

// Predictive metrics and anomaly detection
const fetchPredictiveMetrics = async () => {
  const response = await dashboardAPI.getPredictiveMetrics();
  return response.map((item) => AnomalySchema.parse(item));
};

const DrillDownChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-[var(--color-text)]">Detailed Analytics</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Click on a bar to view detailed data</p>
      </div>
      <div className="card-body h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            onClick={(e) => console.log('Drill-down data:', e)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="source" stroke={tickColor} />
            <YAxis stroke={tickColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <Bar dataKey="count" fill="var(--color-primary-500)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AccessibleButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    className="btn btn-primary"
    onClick={onClick}
    aria-label={label}
  >
    {label}
  </button>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { theme } = useTheme();

  const tickColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Create a socket connection or mock it if it fails
  let socket;
  try {
    socket = io('http://localhost:8080', { 
      reconnectionAttempts: 3,
      timeout: 5000,
      autoConnect: false 
    });
    // Try to connect but don't spam console with errors
    socket.connect();
  } catch (error) {
    console.log('Socket connection unavailable - using mock data');
  }

  useEffect(() => {
    if (socket) {
      socket.on('dashboardMetrics', (data) => {
        setMetrics(data);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  // Generate mock data to show UI without backend
  const generateMockData = () => {
    return {
      totalRawLeads: 1547,
      leadsBySource: [
        { source: 'Google Maps', count: 420 },
        { source: 'LinkedIn', count: 380 },
        { source: 'Facebook', count: 250 },
        { source: 'Yellow Pages', count: 220 },
        { source: 'Yelp', count: 180 },
        { source: 'Trade Sites', count: 97 }
      ],
      statusFunnel: {
        New: 650,
        QA: 320, 
        Approved: 280,
        Rejected: 120,
        Pending: 177
      },
      slaMetrics: {
        avgScrapeTime: 4.5,
        avgAuditTime: 2.3,
        qaBacklog: 42
      }
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      try {
        const data = await dashboardAPI.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data when backend is unavailable
        setMetrics(generateMockData());
      }
    } finally {
      setLoading(false);
    }
  };

  const { data: predictiveMetrics, isLoading: predictiveLoading } = useQuery({
    queryKey: ['predictiveMetrics'],
    queryFn: fetchPredictiveMetrics
  });

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[var(--color-bg-subtle)] rounded-lg h-28"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-subtle)] rounded-lg h-96"></div>
            <div className="bg-[var(--color-bg-subtle)] rounded-lg h-96"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!metrics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)]">Failed to load dashboard data</p>
        </div>
      </Layout>
    );
  }

  if (predictiveLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)]">Loading predictive metrics...</p>
        </div>
      </Layout>
    );
  }

  const statusFunnelColors = [
    'var(--color-primary-500)',
    'var(--color-success-500)',
    'var(--color-warning-500)',
    'var(--color-danger-500)',
    'var(--color-primary-700)',
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Real-time overview of your lead generation pipeline
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="select"
              aria-label="Select time range"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Raw Leads"
            value={metrics.totalRawLeads.toLocaleString()}
            change={{ value: 12.5, type: 'increase' }}
            icon={UsersIcon}
            intent="primary"
          />
          <MetricCard
            title="QA Queue"
            value={metrics.slaMetrics.qaBacklog}
            change={{ value: 2.1, type: 'decrease' }}
            icon={CheckCircleIcon}
            intent="warning"
          />
          <MetricCard
            title="Avg Scrape Time"
            value={`${metrics.slaMetrics.avgScrapeTime}s`}
            change={{ value: 8.2, type: 'decrease' }}
            icon={ClockIcon}
            intent="success"
          />
          <MetricCard
            title="Avg Audit Time"
            value={`${metrics.slaMetrics.avgAuditTime}s`}
            change={{ value: 3.1, type: 'increase' }}
            icon={ChartBarIcon}
            intent="danger"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Source */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-[var(--color-text)]">Leads by Source</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Distribution of leads across different sources</p>
            </div>
            <div className="card-body">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.leadsBySource}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="source" stroke={tickColor} />
                    <YAxis stroke={tickColor} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-bg-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-primary-500)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Funnel */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-[var(--color-text)]">Status Funnel</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Lead progression through the pipeline</p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {Object.entries(metrics.statusFunnel).map(([status, count], index) => {
                  const total = Object.values(metrics.statusFunnel).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: statusFunnelColors[index % statusFunnelColors.length] }}
                        ></div>
                        <span className="text-sm font-medium text-[var(--color-text)] capitalize">
                          {status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-[var(--color-text-muted)]">{percentage}%</span>
                        <span className="text-sm font-semibold text-[var(--color-text)] w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Real-time Activity</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Live feed of system activities</p>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[var(--color-border)]" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-[var(--color-bg-surface)]">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Lead <span className="font-medium text-[var(--color-text)]">ABC Corp</span> approved by QA
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-[var(--color-text-subtle)]">
                        <time>2 minutes ago</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[var(--color-border)]" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-[var(--color-bg-surface)]">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          New batch of <span className="font-medium text-[var(--color-text)]">25 leads</span> scraped from Google Maps
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-[var(--color-text-subtle)]">
                        <time>5 minutes ago</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-warning-500 flex items-center justify-center ring-8 ring-[var(--color-bg-surface)]">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Scoring job started for <span className="font-medium text-[var(--color-text)]">Healthcare</span> category
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-[var(--color-text-subtle)]">
                        <time>8 minutes ago</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Predictive Metrics Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-[var(--color-text)]">Predictive Metrics & Anomaly Detection</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">AI-driven insights and alerts</p>
          </div>
          <div className="card-body">
            <ul className="space-y-3">
              {predictiveMetrics && predictiveMetrics.map((metric, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-[var(--color-bg-subtle)]">
                  <span className="text-sm font-medium text-[var(--color-text)]">{metric.metric}</span>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${metric.anomaly ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300' : 'text-[var(--color-text-muted)]'}`}>
                    {metric.value} {metric.anomaly && '(Anomaly Detected)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Drill Down Chart */}
        <DrillDownChart data={metrics.leadsBySource} />
      </div>
    </Layout>
  );
}
