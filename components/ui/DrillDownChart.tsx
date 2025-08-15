import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../src/design-system/ThemeProvider';

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

export default DrillDownChart;
