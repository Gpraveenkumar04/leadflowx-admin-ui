import React from 'react';
import Layout from '../../src/components/Layout';

interface Props {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  // Thin wrapper used by older pages that import components/layouts/AdminLayout
  return <Layout>{children}</Layout>;
};

export default AdminLayout;
