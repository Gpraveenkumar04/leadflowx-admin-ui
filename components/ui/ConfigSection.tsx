import React from 'react';

interface ConfigSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, description, children }) => (
  <section className="card">
    <div className="card-header">
      <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
    <div className="card-body">{children}</div>
  </section>
);

export default ConfigSection;
