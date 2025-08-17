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
import MetricCard from '../src/components/MetricCard';
import { t } from '../src/i18n';
import { useTheme } from '../src/design-system/ThemeProvider';
import DrillDownChart from '../components/ui/DrillDownChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Predictive metrics removed (no mocks).

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

  // Optional socket connection for real-time updates
  let socket: ReturnType<typeof io> | undefined;
  try {
    socket = io('http://localhost:8080', { 
      reconnectionAttempts: 3,
      timeout: 5000,
      autoConnect: false 
    });
    socket.connect();
  } catch {}

  useEffect(() => {
    if (socket) {
      socket.on('dashboardMetrics', (data: any) => {
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
  const data = await dashboardAPI.getMetrics();
  setMetrics(data);
    } finally {
      setLoading(false);
    }
  };

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
              {t('dashboard.title')}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {t('dashboard.subtitle')}
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
            title={t('dashboard.metrics.total_raw')}
            value={metrics.totalRawLeads.toLocaleString()}
            change={{ value: 12.5, type: 'increase' }}
            icon={UsersIcon}
            intent="primary"
          />
          <MetricCard
            title={t('dashboard.metrics.qa_queue')}
            value={metrics.slaMetrics.qaBacklog}
            change={{ value: 2.1, type: 'decrease' }}
            icon={CheckCircleIcon}
            intent="warning"
          />
          <MetricCard
            title={t('dashboard.metrics.avg_scrape_time')}
            value={`${metrics.slaMetrics.avgScrapeTime}s`}
            change={{ value: 8.2, type: 'decrease' }}
            icon={ClockIcon}
            intent="success"
          />
          <MetricCard
            title={t('dashboard.metrics.avg_audit_time')}
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
              <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.charts.leads_by_source.title')}</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t('dashboard.charts.leads_by_source.desc')}</p>
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
              <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.charts.status_funnel.title')}</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t('dashboard.charts.status_funnel.desc')}</p>
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
            <h3 className="text-lg font-medium text-[var(--color-text)]">{t('dashboard.activity.title')}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t('dashboard.activity.desc')}</p>
          </div>
          <div className="card-body">
            <div className="text-sm text-[var(--color-text-muted)]">No recent activity</div>
          </div>
        </div>


        {/* Drill Down Chart */}
        <DrillDownChart data={metrics.leadsBySource} />
      </div>
    </Layout>
  );
}
