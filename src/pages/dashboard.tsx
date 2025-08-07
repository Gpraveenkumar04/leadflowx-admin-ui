import React, { useState, useEffect, useContext } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  CalendarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import Layout from '@/components/Layout';
import { dashboardAPI } from '@/services/api';
import { DashboardMetrics } from '@/types';
import { ThemeContext } from '@/context/ThemeContext';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  secondaryMetric?: {
    label: string;
    value: string | number;
  };
  theme?: 'light' | 'dark';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color, secondaryMetric, theme = 'light' }) => {
  const bgColor = {
    'bg-blue-500': {
      light: 'bg-blue-50',
      dark: 'bg-blue-900/30'
    },
    'bg-yellow-500': {
      light: 'bg-yellow-50',
      dark: 'bg-yellow-900/30'
    },
    'bg-green-500': {
      light: 'bg-green-50',
      dark: 'bg-green-900/30'
    },
    'bg-purple-500': {
      light: 'bg-purple-50',
      dark: 'bg-purple-900/30'
    },
    'bg-red-500': {
      light: 'bg-red-50',
      dark: 'bg-red-900/30'
    },
  };
  
  const iconContainerClass = `p-3 rounded-xl ${color}`;
  const backgroundClass = color.replace('bg-', '').replace('-500', '');
  
  return (
    <div className={clsx(
      "rounded-xl overflow-hidden shadow-sm border transition-all duration-200",
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 hover:shadow-md hover:shadow-gray-800/40' 
        : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-gray-200/60'
    )}>
      <div className="p-6">
        <div className="flex justify-between">
          <div className={clsx(
            "p-3 rounded-xl",
            theme === 'dark' ? (bgColor as Record<string, { light: string; dark: string }>)[color].dark : (bgColor as Record<string, { light: string; dark: string }>)[color].light
          )}>
            <Icon className={clsx(
              "h-6 w-6",
              {
                'text-blue-600': color === 'bg-blue-500',
                'text-yellow-600': color === 'bg-yellow-500',
                'text-green-600': color === 'bg-green-500',
                'text-purple-600': color === 'bg-purple-500',
                'text-red-600': color === 'bg-red-500',
              },
              theme === 'dark' && {
                'text-blue-400': color === 'bg-blue-500',
                'text-yellow-400': color === 'bg-yellow-500',
                'text-green-400': color === 'bg-green-500',
                'text-purple-400': color === 'bg-purple-500',
                'text-red-400': color === 'bg-red-500',
              }
            )} />
          </div>
          <button className={clsx(
            "p-1 rounded-full focus:outline-none",
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}>
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className={clsx(
          "mt-4 text-sm font-medium truncate",
          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
        )}>
          {title}
        </h3>
        
        <div className="mt-1 flex items-baseline">
          <div className={clsx(
            "text-2xl font-semibold",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {value}
          </div>
          {change && (
            <div className={clsx(
              'ml-2 flex items-center text-sm font-semibold',
              change.type === 'increase' 
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600' 
                : theme === 'dark' ? 'text-red-400' : 'text-red-600'
            )}>
              {change.type === 'increase' ? (
                <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
              )}
              <span className="ml-0.5">{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        
        {secondaryMetric && (
          <div className={clsx(
            "mt-4 pt-3 border-t flex justify-between items-center",
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <span className={clsx(
              "text-xs",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {secondaryMetric.label}
            </span>
            <span className={clsx(
              "text-sm font-medium",
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            )}>
              {secondaryMetric.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const COLORS_DARK = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

const timeRangeOptions = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

export default function Dashboard() {
  const { currentTheme } = useContext(ThemeContext);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      if (!loading) setRefreshing(true);
      if (loading) setLoading(true);
      const data = await dashboardAPI.getMetrics();
      setMetrics(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={clsx(
                "rounded-xl h-40 shadow-sm border",
                currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              )}>
                <div className="p-6">
                  <div className={clsx(
                    "h-8 w-8 rounded-md",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )}></div>
                  <div className={clsx(
                    "h-4 w-24 mt-4 rounded",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )}></div>
                  <div className={clsx(
                    "h-7 w-16 mt-2 rounded",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add loading skeletons for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={clsx(
              "rounded-xl shadow-sm border h-96",
              currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}>
              <div className="p-6">
                <div className={clsx(
                  "h-5 w-36 rounded mb-2",
                  currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}></div>
                <div className={clsx(
                  "h-4 w-64 rounded",
                  currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}></div>
                <div className="h-80 flex items-center justify-center">
                  <DocumentChartBarIcon className={clsx(
                    "h-16 w-16 opacity-20",
                    currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                  )} />
                </div>
              </div>
            </div>
            <div className={clsx(
              "rounded-xl shadow-sm border h-96",
              currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}>
              <div className="p-6">
                <div className={clsx(
                  "h-5 w-36 rounded mb-2",
                  currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}></div>
                <div className={clsx(
                  "h-4 w-64 rounded",
                  currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}></div>
                <div className="h-80 flex items-center justify-center">
                  <DocumentChartBarIcon className={clsx(
                    "h-16 w-16 opacity-20",
                    currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                  )} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button className={clsx(
              "flex items-center px-4 py-2 rounded-md text-sm font-medium",
              currentTheme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Loading dashboard...
            </button>
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
            <div className="flex items-center">
              <h2 className={clsx(
                "text-2xl font-bold leading-7 sm:text-3xl sm:truncate",
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Dashboard
              </h2>
              {refreshing && (
                <ArrowPathIcon className={clsx(
                  "ml-3 h-5 w-5 animate-spin",
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )} />
              )}
            </div>
            <p className={clsx(
              "mt-1 text-sm",
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Real-time overview of your lead generation pipeline
            </p>
          </div>
          
          <div className="mt-4 flex space-x-3 sm:mt-0">
            <div className="relative">
              <button
                onClick={() => setTimeRangeDropdownOpen(!timeRangeDropdownOpen)}
                className={clsx(
                  "flex items-center py-2 px-4 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                  currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {timeRangeOptions.find(option => option.value === selectedTimeRange)?.label}
              </button>
              
              {timeRangeDropdownOpen && (
                <div className={clsx(
                  "absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10",
                  currentTheme === 'dark' 
                    ? 'bg-gray-800 ring-1 ring-black ring-opacity-5 border border-gray-700'
                    : 'bg-white ring-1 ring-black ring-opacity-5 border border-gray-200'
                )}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {timeRangeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedTimeRange(option.value);
                          setTimeRangeDropdownOpen(false);
                        }}
                        className={clsx(
                        // ...rest of dropdown code
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads by Source */}
          <div className={clsx(
            "rounded-xl overflow-hidden shadow-sm border",
            currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className={clsx(
                  "text-lg font-semibold",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Leads by Source
                </h3>
                <div className="flex items-center">
                  <button className={clsx(
                    "p-1 rounded-full",
                    currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  )}>
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className={clsx(
                "text-sm mb-6",
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                Distribution of leads across different sources
              </p>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.leadsBySource ?? []} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="source" 
                      tick={{ fill: currentTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: currentTheme === 'dark' ? '#4B5563' : '#D1D5DB' }}
                    />
                    <YAxis 
                      tick={{ fill: currentTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: currentTheme === 'dark' ? '#4B5563' : '#D1D5DB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: currentTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderColor: currentTheme === 'dark' ? '#374151' : '#E5E7EB',
                        color: currentTheme === 'dark' ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Legend wrapperStyle={{ 
                      marginTop: 10, 
                      color: currentTheme === 'dark' ? '#D1D5DB' : '#4B5563'
                    }} />
                    <Bar dataKey="count" name="Lead Count" fill={currentTheme === 'dark' ? '#60A5FA' : '#3B82F6'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Funnel */}
          <div className={clsx(
            "rounded-xl overflow-hidden shadow-sm border",
            currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className={clsx(
                  "text-lg font-semibold",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Status Funnel
                </h3>
                <div className="flex items-center">
                  <button className={clsx(
                    "p-1 rounded-full",
                    currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  )}>
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className={clsx(
                "text-sm mb-6",
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                Lead progression through the pipeline
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics && metrics.statusFunnel
                          ? Object.entries(metrics.statusFunnel).map(([status, count], index) => ({
                              name: status.replace(/([A-Z])/g, ' $1').trim(),
                              value: count
                            }))
                          : []
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                      >
                        {(metrics && metrics.statusFunnel
                          ? Object.entries(metrics.statusFunnel)
                          : []
                        ).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={currentTheme === 'dark' ? COLORS_DARK[index % COLORS_DARK.length] : COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: currentTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                          borderColor: currentTheme === 'dark' ? '#374151' : '#E5E7EB',
                          color: currentTheme === 'dark' ? '#F9FAFB' : '#111827'
                        }}
                        formatter={(value, name) => [value, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4 my-auto">
                  {Object.entries(metrics.statusFunnel).map(([status, count], index) => {
                    const total = Object.values(metrics.statusFunnel).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={clsx(
                            "w-3 h-3 rounded-full mr-3",
                            currentTheme === 'dark' ? {
                              'bg-blue-400': index === 0,
                              'bg-green-400': index === 1,
                              'bg-yellow-400': index === 2,
                              'bg-red-400': index === 3,
                              'bg-purple-400': index === 4
                            } : {
                              'bg-blue-500': index === 0,
                              'bg-green-500': index === 1,
                              'bg-yellow-500': index === 2,
                              'bg-red-500': index === 3,
                              'bg-purple-500': index === 4
                            }
                          )}></div>
                          <span className={clsx(
                            "text-sm font-medium capitalize",
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          )}>
                            {status.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={clsx(
                            "text-sm",
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          )}>{percentage}%</span>
                          <span className={clsx(
                            "text-sm font-medium",
                            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          )}>{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className={clsx(
          "rounded-xl overflow-hidden shadow-sm border",
          currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className={clsx(
                "text-lg font-semibold",
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Real-time Activity
              </h3>
              <div className="flex items-center space-x-2">
                <button className={clsx(
                  "p-1 rounded-full",
                  currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}>
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className={clsx(
              "text-sm mb-6",
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Live feed of system activities
            </p>
            
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        Lead <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>ABC Corp</span> approved by QA
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>2 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                    )}>
                      Approved
                    </div>
                  </div>
                </li>
                
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        New batch of <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>25 leads</span> scraped from Google Maps
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>5 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                    )}>
                      New Leads
                    </div>
                  </div>
                </li>
                
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        Scoring job started for <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>Healthcare</span> category
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>8 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                    )}>
                      Processing
                    </div>
                  </div>
                </li>
                
                <li className="relative">
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <ChartBarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        System performance report for <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>March</span> completed
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>12 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                    )}>
                      Report
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-6">
              <button className={clsx(
                "w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium",
                currentTheme === 'dark' 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}>
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  if (!metrics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
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
        <div className={clsx(
          "rounded-xl overflow-hidden shadow-sm border",
          currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className={clsx(
                "text-lg font-semibold",
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Real-time Activity
              </h3>
              <div className="flex items-center space-x-2">
                <button className={clsx(
                  "p-1 rounded-full",
                  currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}>
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className={clsx(
              "text-sm mb-6",
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Live feed of system activities
            </p>
            
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        Lead <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>ABC Corp</span> approved by QA
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>2 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                    )}>
                      Approved
                    </div>
                  </div>
                </li>
                
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        New batch of <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>25 leads</span> scraped from Google Maps
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>5 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                    )}>
                      New Leads
                    </div>
                  </div>
                </li>
                
                <li className="relative pb-8">
                  <span className={clsx(
                    "absolute top-5 left-4 -ml-px h-full w-0.5",
                    currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  )} aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        Scoring job started for <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>Healthcare</span> category
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>8 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                    )}>
                      Processing
                    </div>
                  </div>
                </li>
                
                <li className="relative">
                  <div className="relative flex items-start space-x-3">
                    <div className={clsx(
                      "relative px-1",
                      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    )}>
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <ChartBarIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className={clsx(
                        "text-sm",
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      )}>
                        System performance report for <span className={clsx(
                          "font-medium",
                          currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>March</span> completed
                      </div>
                      <div className={clsx(
                        "mt-1 text-xs",
                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      )}>
                        <time>12 minutes ago</time>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      currentTheme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                    )}>
                      Report
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-6">
              <button className={clsx(
                "w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium",
                currentTheme === 'dark' 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}>
                View all activity
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Weekly Performance */}
          <div className={clsx(
            "rounded-xl overflow-hidden shadow-sm border",
            currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className={clsx(
                  "text-lg font-semibold",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Weekly Performance
                </h3>
                <div className="flex items-center space-x-2">
                  <button className={clsx(
                    "p-1 rounded-full",
                    currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  )}>
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className={clsx(
                "text-sm",
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                Lead acquisition trend
              </p>
              
              <div className="mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Mon', leads: 65 },
                      { name: 'Tue', leads: 59 },
                      { name: 'Wed', leads: 80 },
                      { name: 'Thu', leads: 81 },
                      { name: 'Fri', leads: 56 },
                      { name: 'Sat', leads: 40 },
                      { name: 'Sun', leads: 35 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: currentTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: currentTheme === 'dark' ? '#4B5563' : '#D1D5DB' }}
                    />
                    <YAxis 
                      tick={{ fill: currentTheme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      tickLine={{ stroke: currentTheme === 'dark' ? '#4B5563' : '#D1D5DB' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: currentTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderColor: currentTheme === 'dark' ? '#374151' : '#E5E7EB',
                        color: currentTheme === 'dark' ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      name="New Leads"
                      stroke={currentTheme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                      strokeWidth={2} 
                      dot={{ stroke: currentTheme === 'dark' ? '#60A5FA' : '#3B82F6', fill: currentTheme === 'dark' ? '#60A5FA' : '#3B82F6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className={clsx(
                "mt-4 pt-4 border-t grid grid-cols-3 gap-4",
                currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="text-center">
                  <p className={clsx(
                    "text-sm font-medium",
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    Total
                  </p>
                  <p className={clsx(
                    "text-lg font-semibold mt-1",
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    416
                  </p>
                </div>
                <div className="text-center">
                  <p className={clsx(
                    "text-sm font-medium",
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    Average
                  </p>
                  <p className={clsx(
                    "text-lg font-semibold mt-1",
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    59.4
                  </p>
                </div>
                <div className="text-center">
                  <p className={clsx(
                    "text-sm font-medium",
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    Change
                  </p>
                  <p className="text-lg font-semibold mt-1 text-green-500">
                    +12.5%
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Leads */}
          <div className={clsx(
            "rounded-xl overflow-hidden shadow-sm border",
            currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={clsx(
                  "text-lg font-semibold",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Recent Leads
                </h3>
                <button className={clsx(
                  "text-xs font-medium",
                  currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )}>
                  View all
                </button>
              </div>
              
              <div className="space-y-5">
                {[
                  { name: 'Acme Corporation', source: 'Google Maps', time: '10 minutes ago', status: 'New' },
                  { name: 'Widget Solutions Ltd', source: 'LinkedIn', time: '25 minutes ago', status: 'Qualified' },
                  { name: 'Tech Innovations Inc', source: 'Facebook', time: '1 hour ago', status: 'Contacting' },
                  { name: 'Smart Services Co', source: 'Yelp', time: '3 hours ago', status: 'New' },
                ].map((lead, idx) => (
                  <div key={idx} className={clsx(
                    "flex items-center p-3 rounded-lg",
                    currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  )}>
                    <div className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                      lead.status === 'New' 
                        ? currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        : lead.status === 'Qualified'
                        ? currentTheme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                        : currentTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {lead.name.charAt(0)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={clsx(
                        "text-sm font-medium",
                        currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{lead.name}</p>
                      <div className="flex items-center mt-1">
                        <span className={clsx(
                          "text-xs",
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>{lead.source}</span>
                        <span className={clsx(
                          "mx-1.5",
                          currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                        )}>•</span>
                        <span className={clsx(
                          "text-xs",
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>{lead.time}</span>
                      </div>
                    </div>
                    <div className={clsx(
                      "text-xs font-medium px-2 py-1 rounded",
                      lead.status === 'New' 
                        ? currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        : lead.status === 'Qualified'
                        ? currentTheme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                        : currentTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {lead.status}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={clsx(
                "w-full mt-5 flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium",
                currentTheme === 'dark' 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}>
                Load more
              </button>
            </div>
          </div>
          
          {/* System Status */}
          <div className={clsx(
            "rounded-xl overflow-hidden shadow-sm border",
            currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={clsx(
                  "text-lg font-semibold",
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  System Status
                </h3>
                <span className={clsx(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  currentTheme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                )}>
                  Healthy
                </span>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'API Service', status: 'Operational', uptime: '99.9%', latency: '45ms' },
                  { name: 'Scraper Workers', status: 'Operational', uptime: '99.7%', latency: '120ms' },
                  { name: 'Database', status: 'Operational', uptime: '100%', latency: '15ms' },
                  { name: 'Queue Service', status: 'Degraded', uptime: '97.2%', latency: '280ms' },
                  { name: 'Storage Service', status: 'Operational', uptime: '99.9%', latency: '35ms' },
                ].map((service, idx) => (
                  <div key={idx} className={clsx(
                    "flex items-center justify-between p-3 rounded-lg",
                    currentTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                  )}>
                    <div className="flex items-center">
                      <div className={clsx(
                        "h-2 w-2 rounded-full mr-2",
                        service.status === 'Operational' 
                          ? 'bg-green-500' 
                          : service.status === 'Degraded' 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      )}></div>
                      <span className={clsx(
                        "text-sm font-medium",
                        currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={clsx(
                          "text-xs font-medium",
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          Uptime
                        </div>
                        <div className={clsx(
                          "text-sm",
                          currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        )}>
                          {service.uptime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={clsx(
                          "text-xs font-medium",
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          Latency
                        </div>
                        <div className={clsx(
                          "text-sm",
                          service.status === 'Degraded' ? 'text-yellow-500' : 
                          currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        )}>
                          {service.latency}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={clsx(
                "mt-6 pt-4 border-t",
                currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="flex items-center justify-between">
                  <span className={clsx(
                    "text-sm",
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    Last checked:
                  </span>
                  <span className={clsx(
                    "text-sm font-medium",
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    2 minutes ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
