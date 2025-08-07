import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import Layout from '../src/components/Layout';
import { metricsAPI } from '../src/services/api';
import { clsx } from 'clsx';

interface MetricsPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ title, children, className }) => (
  <div className={clsx("card", className)}>
    <div className="card-header">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
    <div className="card-body">
      {children}
    </div>
  </div>
);

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState('1h');
  const [loading, setLoading] = useState(true);
  const [scrapingMetrics, setScrapingMetrics] = useState<any[]>([]);
  const [kafkaMetrics, setKafkaMetrics] = useState<any[]>([]);
  const [errorMetrics, setErrorMetrics] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [scrapingData, kafkaData, errorData, alertsData] = await Promise.all([
        metricsAPI.getScrapingMetrics(),
        metricsAPI.getKafkaMetrics(),
        metricsAPI.getErrorMetrics(),
        metricsAPI.getAlerts()
      ]);
      
      setScrapingMetrics(scrapingData);
      setKafkaMetrics(kafkaData);
      setErrorMetrics(errorData);
      setAlerts(alertsData);
      
      // Mock log data - in real implementation, this would come from your logging service
      setLogs([
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'scraper-google-maps',
          message: 'Successfully scraped 25 leads from NYC restaurants'
        },
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'warn',
          service: 'auditor',
          message: 'SSL check timeout for example.com (timeout after 10s)'
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'error',
          service: 'scorer',
          message: 'Failed to connect to external scoring API'
        },
        {
          timestamp: new Date(Date.now() - 180000).toISOString(),
          level: 'info',
          service: 'ingestion-api',
          message: 'Processed 150 leads from Kafka topic'
        }
      ]);
      
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600';
      case 'warn':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      case 'debug':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Mock data for charts
  const scrapingChartData = [
    { time: '00:00', googleMaps: 45, linkedin: 32, facebook: 28, craigslist: 15 },
    { time: '04:00', googleMaps: 52, linkedin: 38, facebook: 35, craigslist: 22 },
    { time: '08:00', googleMaps: 68, linkedin: 45, facebook: 42, craigslist: 30 },
    { time: '12:00', googleMaps: 75, linkedin: 52, facebook: 48, craigslist: 35 },
    { time: '16:00', googleMaps: 82, linkedin: 58, facebook: 55, craigslist: 42 },
    { time: '20:00', googleMaps: 65, linkedin: 42, facebook: 38, craigslist: 28 }
  ];

  const kafkaLagData = [
    { time: '00:00', consumerLag: 120, producerThroughput: 850 },
    { time: '04:00', consumerLag: 95, producerThroughput: 920 },
    { time: '08:00', consumerLag: 150, producerThroughput: 1200 },
    { time: '12:00', consumerLag: 180, producerThroughput: 1450 },
    { time: '16:00', consumerLag: 220, producerThroughput: 1600 },
    { time: '20:00', consumerLag: 160, producerThroughput: 1100 }
  ];

  const errorData = [
    { time: '00:00', '4xx': 12, '5xx': 3 },
    { time: '04:00', '4xx': 8, '5xx': 2 },
    { time: '08:00', '4xx': 15, '5xx': 5 },
    { time: '12:00', '4xx': 22, '5xx': 8 },
    { time: '16:00', '4xx': 18, '5xx': 6 },
    { time: '20:00', '4xx': 10, '5xx': 2 }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
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
              Metrics & Monitoring
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              System performance, alerts, and logs
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={clsx(
                "btn btn-sm",
                autoRefresh ? "btn-primary" : "btn-secondary"
              )}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Auto-refresh {autoRefresh ? 'On' : 'Off'}
            </button>
            <button onClick={fetchMetrics} className="btn btn-secondary btn-sm">
              Refresh Now
            </button>
          </div>
        </div>

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <div className="card border-l-4 border-red-500">
            <div className="card-header bg-red-50">
              <h3 className="text-lg leading-6 font-medium text-red-900">Active Alerts</h3>
            </div>
            <div className="card-body bg-red-50">
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-500">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <button className="btn btn-sm btn-secondary">
                      Acknowledge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scraping Metrics */}
          <MetricsPanel title="Scrapes per Second by Source">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scrapingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="googleMaps" stroke="#3B82F6" strokeWidth={2} name="Google Maps" />
                  <Line type="monotone" dataKey="linkedin" stroke="#10B981" strokeWidth={2} name="LinkedIn" />
                  <Line type="monotone" dataKey="facebook" stroke="#F59E0B" strokeWidth={2} name="Facebook" />
                  <Line type="monotone" dataKey="craigslist" stroke="#EF4444" strokeWidth={2} name="Craigslist" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* Kafka Metrics */}
          <MetricsPanel title="Kafka Consumer Lag">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kafkaLagData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="consumerLag" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Consumer Lag" />
                  <Area type="monotone" dataKey="producerThroughput" stackId="2" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Producer Throughput" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* Error Metrics */}
          <MetricsPanel title="HTTP Error Counts">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="4xx" fill="#F59E0B" name="4xx Errors" />
                  <Bar dataKey="5xx" fill="#EF4444" name="5xx Errors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* System Health */}
          <MetricsPanel title="System Health">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-green-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">245ms</div>
                <div className="text-sm text-blue-600">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12/15</div>
                <div className="text-sm text-purple-600">Active Workers</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">1.2k</div>
                <div className="text-sm text-yellow-600">Queue Depth</div>
              </div>
            </div>
          </MetricsPanel>
        </div>

        {/* Logs Panel */}
        <MetricsPanel title="Recent Logs" className="col-span-full">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className={clsx("text-xs font-medium uppercase", getLogLevelColor(log.level))}>
                    {log.level}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-600">[{log.service}]</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-900">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Showing last 100 log entries</span>
            <button className="text-primary-600 hover:text-primary-800">
              View all logs →
            </button>
          </div>
        </MetricsPanel>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <ChartBarIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-500">Total Requests</div>
              <div className="text-xs text-green-600 mt-1">↗ +12% from yesterday</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ClockIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">245ms</div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
              <div className="text-xs text-green-600 mt-1">↗ -8% faster than average</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-red-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-500">Active Alerts</div>
              <div className="text-xs text-red-600 mt-1">2 critical, 1 warning</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ArrowPathIcon className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">98.5%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="text-xs text-green-600 mt-1">↗ +0.2% improvement</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
