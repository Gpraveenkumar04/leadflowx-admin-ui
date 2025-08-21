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
  // optional tailwind color class passed by tests or callers (e.g. 'bg-blue-500')
  color?: string;
}

const intentStyles: Record<MetricIntent, { bg: string }> = {
  primary: { bg: 'bg-[var(--color-primary-500)]' },
  success: { bg: 'bg-[var(--color-success-500)]' },
  warning: { bg: 'bg-[var(--color-warning-500)]' },
  danger: { bg: 'bg-[var(--color-danger-500)]' },
  secondary: { bg: 'bg-[var(--color-text-muted)]' },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, intent = 'secondary', color }) => {
  const styles = intentStyles[intent];
  const bgClass = color ? color : styles.bg;

  return (
    <div className="card group transition-transform duration-200 hover:translate-y-[-1px]">
      <div className="card-body">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ring-1 ring-[color-mix(in_srgb,_white_30%,_transparent)] shadow-sm ${bgClass}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-[var(--color-text-muted)] truncate">{title}</dt>
              <dd className="mt-1 flex items-baseline">
                <div className="text-2xl font-semibold text-[var(--color-text)] tracking-tight">{value}</div>
                {change && (
                  <div className={`ml-2 inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full border ${
                    change.type === 'increase'
                      ? 'text-[var(--color-success-700)] bg-[var(--color-success-100)] border-[var(--color-success-200)]'
                      : 'text-[var(--color-danger-700)] bg-[var(--color-danger-100)] border-[var(--color-danger-200)]'
                  }`}>
                    {change.type === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4 mr-0.5" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-0.5" />
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
