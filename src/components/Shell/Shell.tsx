import React from 'react';
import Layout from '../Layout';

// Small Shell abstraction for Phase 1 redesign.
// Keeps current behavior but gives a place to evolve the header/sidebar into smaller components.

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  // Delegate to the existing Layout for now. Later we will extract Topbar/Sidebar into small components.
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default Shell;
