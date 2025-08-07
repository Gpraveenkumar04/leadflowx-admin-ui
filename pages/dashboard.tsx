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

const DrillDownChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="card">
    <div className="card-header">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Detailed Analytics</h3>
      <p className="mt-1 text-sm text-gray-500">Click on a bar to view detailed data</p>
    </div>
    <div className="card-body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          onClick={(e) => console.log('Drill-down data:', e)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="source" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

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

  const socket = io('http://your-websocket-server-url');

  useEffect(() => {
    socket.on('dashboardMetrics', (data) => {
      setMetrics(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="card-body">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!metrics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </Layout>
    );
  }

  if (predictiveLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <p>Loading predictive metrics...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time overview of your lead generation pipeline
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="select"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Raw Leads"
            value={metrics.totalRawLeads.toLocaleString()}
            change={{ value: 12.5, type: 'increase' }}
            icon={UsersIcon}
            color="bg-blue-500"
          />
          <MetricCard
            title="QA Queue"
            value={metrics.slaMetrics.qaBacklog}
            change={{ value: 2.1, type: 'decrease' }}
            icon={CheckCircleIcon}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Avg Scrape Time"
            value={`${metrics.slaMetrics.avgScrapeTime}s`}
            change={{ value: 8.2, type: 'decrease' }}
            icon={ClockIcon}
            color="bg-green-500"
          />
          <MetricCard
            title="Avg Audit Time"
            value={`${metrics.slaMetrics.avgAuditTime}s`}
            change={{ value: 3.1, type: 'increase' }}
            icon={ChartBarIcon}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Source */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Leads by Source</h3>
              <p className="mt-1 text-sm text-gray-500">Distribution of leads across different sources</p>
            </div>
            <div className="card-body">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.leadsBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Funnel */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Status Funnel</h3>
              <p className="mt-1 text-sm text-gray-500">Lead progression through the pipeline</p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {Object.entries(metrics.statusFunnel).map(([status, count], index) => {
                  const total = Object.values(metrics.statusFunnel).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{percentage}%</span>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Activity</h3>
            <p className="mt-1 text-sm text-gray-500">Live feed of system activities</p>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Lead <span className="font-medium text-gray-900">ABC Corp</span> approved by QA
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>2 minutes ago</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New batch of <span className="font-medium text-gray-900">25 leads</span> scraped from Google Maps
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>5 minutes ago</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Scoring job started for <span className="font-medium text-gray-900">Healthcare</span> category
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">Predictive Metrics</h3>
            <p className="mt-1 text-sm text-gray-500">Insights and anomaly detection</p>
          </div>
          <div className="card-body">
            <ul>
              {predictiveMetrics.map((metric, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className={`text-sm font-semibold ${metric.anomaly ? 'text-red-600' : 'text-green-600'}`}>
                    {metric.value} {metric.anomaly && '(Anomaly)'}
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
