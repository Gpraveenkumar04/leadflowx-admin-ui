import React from 'react';
import { clsx } from 'clsx';

interface MetricsPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ title, children, className }) => (
  <div className={clsx('card', className)}>
    <div className="card-header">
      <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">{title}</h3>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default MetricsPanel;
