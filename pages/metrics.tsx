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
import { useTheme } from '../src/design-system/ThemeProvider';

interface MetricsPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ title, children, className }) => (
  <div className={clsx("card", className)}>
    <div className="card-header">
      <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">{title}</h3>
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
  const { theme } = useTheme();
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

  const getLogLevelClass = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-[var(--color-danger-500)]';
      case 'warn':
        return 'text-[var(--color-warning-500)]';
      case 'info':
        return 'text-[var(--color-primary-500)]';
      case 'debug':
        return 'text-[var(--color-text-subtle)]';
      default:
        return 'text-[var(--color-text-muted)]';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-[var(--color-danger-500)]" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-[var(--color-warning-500)]" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-[var(--color-primary-500)]" />;
    }
  };

  // Chart colors
  const chartColors = {
    grid: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tick: theme === 'dark' ? '#9ca3af' : '#4b5563',
    primary: 'var(--color-primary-500)',
    success: 'var(--color-success-500)',
    warning: 'var(--color-warning-500)',
    danger: 'var(--color-danger-500)',
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
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[var(--color-bg-subtle)] rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-[var(--color-bg-subtle)] rounded"></div>
            <div className="h-80 bg-[var(--color-bg-subtle)] rounded"></div>
            <div className="h-80 bg-[var(--color-bg-subtle)] rounded"></div>
            <div className="h-80 bg-[var(--color-bg-subtle)] rounded"></div>
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
            <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
              Metrics & Monitoring
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
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
              <ArrowPathIcon className={clsx("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
              Auto-refresh {autoRefresh ? 'On' : 'Off'}
            </button>
            <button onClick={fetchMetrics} className="btn btn-secondary btn-sm">
              Refresh Now
            </button>
          </div>
        </div>

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <div className="card border-l-4 border-[var(--color-danger-500)]">
            <div className="card-header bg-[var(--color-danger-100)]">
              <h3 className="text-lg leading-6 font-medium text-[var(--color-danger-800)]">Active Alerts</h3>
            </div>
            <div className="card-body bg-[var(--color-danger-100)]">
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-[var(--color-bg-surface)] rounded-lg shadow-sm">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)]">{alert.title}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{alert.message}</p>
                      <p className="text-xs text-[var(--color-text-subtle)] mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
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
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: chartColors.tick }} />
                  <YAxis tick={{ fill: chartColors.tick }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-bg-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }} 
                  />
                  <Line type="monotone" dataKey="googleMaps" stroke={chartColors.primary} strokeWidth={2} name="Google Maps" dot={false} />
                  <Line type="monotone" dataKey="linkedin" stroke={chartColors.success} strokeWidth={2} name="LinkedIn" dot={false} />
                  <Line type="monotone" dataKey="facebook" stroke={chartColors.warning} strokeWidth={2} name="Facebook" dot={false} />
                  <Line type="monotone" dataKey="craigslist" stroke={chartColors.danger} strokeWidth={2} name="Craigslist" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* Kafka Metrics */}
          <MetricsPanel title="Kafka Consumer Lag">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kafkaLagData}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: chartColors.tick }} />
                  <YAxis tick={{ fill: chartColors.tick }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-bg-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }} 
                  />
                  <Area type="monotone" dataKey="consumerLag" stackId="1" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.3} name="Consumer Lag" />
                  <Area type="monotone" dataKey="producerThroughput" stackId="2" stroke={chartColors.success} fill={chartColors.success} fillOpacity={0.3} name="Producer Throughput" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* Error Metrics */}
          <MetricsPanel title="HTTP Error Counts">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData}>
                  <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: chartColors.tick }} />
                  <YAxis tick={{ fill: chartColors.tick }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-bg-surface)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }} 
                  />
                  <Bar dataKey="4xx" fill={chartColors.warning} name="4xx Errors" />
                  <Bar dataKey="5xx" fill={chartColors.danger} name="5xx Errors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MetricsPanel>

          {/* System Health */}
          <MetricsPanel title="System Health">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--color-success-100)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-success-600)]">99.9%</div>
                <div className="text-sm text-[var(--color-success-600)]">Uptime</div>
              </div>
              <div className="text-center p-4 bg-[var(--color-primary-100)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-primary-600)]">245ms</div>
                <div className="text-sm text-[var(--color-primary-600)]">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-[var(--color-bg-subtle)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-text)]">12/15</div>
                <div className="text-sm text-[var(--color-text-muted)]">Active Workers</div>
              </div>
              <div className="text-center p-4 bg-[var(--color-warning-100)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-warning-600)]">1.2k</div>
                <div className="text-sm text-[var(--color-warning-600)]">Queue Depth</div>
              </div>
            </div>
          </MetricsPanel>
        </div>

        {/* Logs Panel */}
        <MetricsPanel title="Recent Logs" className="col-span-full">
          <div className="space-y-2 max-h-96 overflow-y-auto p-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-[var(--color-bg-subtle)] rounded-lg font-mono text-sm">
                <div className="flex-shrink-0">
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex-shrink-0 w-12 text-center">
                  <span className={clsx("text-xs font-medium uppercase", getLogLevelClass(log.level))}>
                    {log.level}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-[var(--color-text-muted)]">[{log.service}]</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--color-text)]">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-[var(--color-text-muted)]">
            <span>Showing last 100 log entries</span>
            <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
              View all logs →
            </button>
          </div>
        </MetricsPanel>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <ChartBarIcon className="mx-auto h-8 w-8 text-[var(--color-primary-500)] mb-2" />
              <div className="text-2xl font-bold text-[var(--color-text)]">2,847</div>
              <div className="text-sm text-[var(--color-text-muted)]">Total Requests</div>
              <div className="text-xs text-[var(--color-success-500)] mt-1">↗ +12% from yesterday</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ClockIcon className="mx-auto h-8 w-8 text-[var(--color-success-500)] mb-2" />
              <div className="text-2xl font-bold text-[var(--color-text)]">245ms</div>
              <div className="text-sm text-[var(--color-text-muted)]">Avg Response Time</div>
              <div className="text-xs text-[var(--color-success-500)] mt-1">↘ -8% faster than average</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-[var(--color-danger-500)] mb-2" />
              <div className="text-2xl font-bold text-[var(--color-text)]">3</div>
              <div className="text-sm text-[var(--color-text-muted)]">Active Alerts</div>
              <div className="text-xs text-[var(--color-danger-500)] mt-1">2 critical, 1 warning</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <ArrowPathIcon className="mx-auto h-8 w-8 text-[var(--color-text-subtle)] mb-2" />
              <div className="text-2xl font-bold text-[var(--color-text)]">98.5%</div>
              <div className="text-sm text-[var(--color-text-muted)]">Success Rate</div>
              <div className="text-xs text-[var(--color-success-500)] mt-1">↗ +0.2% improvement</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
