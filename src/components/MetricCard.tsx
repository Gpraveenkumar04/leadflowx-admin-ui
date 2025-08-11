import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

type MetricIntent = 'primary' | 'success' | 'warning' | 'danger' | 'secondary';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  intent?: MetricIntent;
}

const intentStyles: Record<MetricIntent, { bg: string }> = {
  primary: { bg: 'bg-[var(--color-primary-500)]' },
  success: { bg: 'bg-[var(--color-success-500)]' },
  warning: { bg: 'bg-[var(--color-warning-500)]' },
  danger: { bg: 'bg-[var(--color-danger-500)]' },
  secondary: { bg: 'bg-[var(--color-text-muted)]' },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, intent = 'secondary' }) => {
  const styles = intentStyles[intent];

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${styles.bg}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-[var(--color-text-muted)] truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-[var(--color-text)]">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.type === 'increase' ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'
                  }`}>
                    {change.type === 'increase' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="sr-only">{change.type === 'increase' ? 'Increased' : 'Decreased'} by</span>
                    {Math.abs(change.value)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
