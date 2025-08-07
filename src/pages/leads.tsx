import React, { useState, useEffect, useMemo } from 'react';
import { 
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { leadsAPI } from '@/services/api';
import { Lead, LeadFilters, TableSort, QAStatus, DATA_SOURCES } from '@/types';
import { clsx } from 'clsx';

interface LeadTableProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  onLeadUpdate: (lead: Lead) => void;
  selectedLeads: number[];
  onSelectLead: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onLeadSelect,
  onLeadUpdate,
  selectedLeads,
  onSelectLead,
  onSelectAll,
}) => {
  const [editingField, setEditingField] = useState<{ id: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (id: number, field: string, currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue);
  };

  const handleSave = async (lead: Lead) => {
    if (!editingField) return;
    
    try {
      const updatedLead = {
        ...lead,
        [editingField.field]: editValue
      };
      await onLeadUpdate(updatedLead);
      setEditingField(null);
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const getQAStatusBadge = (status?: QAStatus) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      case 'needs_review':
        return <span className="badge badge-warning">Needs Review</span>;
      default:
        return <span className="badge badge-secondary">Pending</span>;
    }
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return <span className="badge badge-secondary">-</span>;
    
    const color = score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger';
    return <span className={`badge ${color}`}>{score}</span>;
  };

  return (
    <div className="card">
      <div className="overflow-hidden">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell w-4">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </th>
              <th className="table-header-cell">Company</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Phone</th>
              <th className="table-header-cell">Website</th>
              <th className="table-header-cell">Source</th>
              <th className="table-header-cell">Scraped At</th>
              <th className="table-header-cell">Audit Score</th>
              <th className="table-header-cell">QA Status</th>
              <th className="table-header-cell">Lead Score</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onSelectLead(lead.id)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </td>
                <td className="table-cell">
                  {editingField?.id === lead.id && editingField.field === 'company' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input py-1 px-2 text-sm"
                        autoFocus
                      />
                      <button onClick={() => handleSave(lead)} className="text-green-600 hover:text-green-800">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handleEdit(lead.id, 'company', lead.company)}
                    >
                      <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  {editingField?.id === lead.id && editingField.field === 'name' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input py-1 px-2 text-sm"
                        autoFocus
                      />
                      <button onClick={() => handleSave(lead)} className="text-green-600 hover:text-green-800">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handleEdit(lead.id, 'name', lead.name)}
                    >
                      <div className="text-sm text-gray-900">{lead.name}</div>
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">{lead.email}</div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{lead.phone}</span>
                    <button
                      onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                      className="text-primary-600 hover:text-primary-800"
                      title="Click to call"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 truncate max-w-32">{lead.website}</span>
                    <button
                      onClick={() => window.open(lead.website, '_blank')}
                      className="text-primary-600 hover:text-primary-800"
                      title="Open website"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="badge badge-primary">{lead.source || 'Unknown'}</span>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-500">
                    {lead.scrapedAt ? new Date(lead.scrapedAt).toLocaleDateString() : '-'}
                  </div>
                </td>
                <td className="table-cell">
                  {getScoreBadge(lead.auditScore)}
                </td>
                <td className="table-cell">
                  {getQAStatusBadge(lead.qaStatus)}
                </td>
                <td className="table-cell">
                  {getScoreBadge(lead.leadScore)}
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLeadSelect(lead)}
                      className="text-gray-400 hover:text-gray-600"
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(lead.correlationId)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy correlation ID"
                    >
                      <span className="text-xs">ID</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({});
  const [sort, setSort] = useState<TableSort>({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 0 });

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, [pagination.page, filters, sort]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getLeads(pagination.page, pagination.pageSize, filters, sort);
      setLeads(response.data || []);
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadUpdate = async (updatedLead: Lead) => {
    try {
      await leadsAPI.updateLead(updatedLead.id, updatedLead);
      setLeads(prev => prev.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      ));
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleSelectLead = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedLeads(selected ? leads.map(lead => lead.id) : []);
  };

  const handleBulkApprove = async () => {
    try {
      await leadsAPI.bulkApprove(selectedLeads);
      await fetchLeads();
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  const handleBulkReject = async () => {
    try {
      await leadsAPI.bulkReject(selectedLeads, 'Bulk rejection');
      await fetchLeads();
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to bulk reject:', error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await leadsAPI.exportLeads(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'leads.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export leads:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
              Lead Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and review your lead database
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            {selectedLeads.length > 0 && (
              <>
                <button onClick={handleBulkApprove} className="btn btn-success btn-sm">
                  Approve Selected ({selectedLeads.length})
                </button>
                <button onClick={handleBulkReject} className="btn btn-danger btn-sm">
                  Reject Selected
                </button>
              </>
            )}
            <button onClick={handleExport} className="btn btn-secondary btn-sm">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="input pl-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <select
                  value={filters.source?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    source: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">All Sources</option>
                  {DATA_SOURCES.map(source => (
                    <option key={source} value={source}>
                      {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">QA Status</label>
                <select
                  value={filters.qaStatus?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    qaStatus: e.target.value ? [e.target.value as QAStatus] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="needs_review">Needs Review</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Range</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="input mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <LeadTable
          leads={leads}
          onLeadSelect={setSelectedLead}
          onLeadUpdate={handleLeadUpdate}
          selectedLeads={selectedLeads}
          onSelectLead={handleSelectLead}
          onSelectAll={handleSelectAll}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="btn btn-secondary btn-sm rounded-l-md"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="btn btn-secondary btn-sm rounded-r-md"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
