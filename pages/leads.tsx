import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  BookmarkIcon,
  TagIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import LeadDetail from '../src/components/LeadDetail';
import { leadsAPI } from '../src/services/api';
import { Lead, LeadFilters, TableSort, QAStatus, DATA_SOURCES } from '../src/types';
import { clsx } from 'clsx';
import BulkActions from '../src/components/BulkActions';

interface SavedView {
  id: string;
  name: string;
  filters: LeadFilters;
  sort: TableSort;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface LeadTableProps {
  onAddTag: (leadId: number, tag: Tag) => void;
  onRemoveTag: (leadId: number, tagId: string) => void;
  tags: Tag[];
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
  onAddTag,
  onRemoveTag,
  tags,
}) => {
  const [editingField, setEditingField] = useState<{ id: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showTagMenu, setShowTagMenu] = useState<number | null>(null);

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
              <th className="table-header-cell">Tags</th>
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
                  <div className="flex flex-wrap gap-1 items-center">
                    {lead.tags?.map(tag => (
                      <span 
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        {tag.name}
                        <button
                          onClick={() => onRemoveTag(lead.id, tag.id)}
                          className="ml-1 text-xs hover:text-gray-500"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => setShowTagMenu(lead.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <TagIcon className="h-4 w-4" />
                    </button>
                    
                    {showTagMenu === lead.id && (
                      <div className="absolute mt-8 z-10 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        {tags.filter(tag => !lead.tags?.some(t => t.id === tag.id)).map(tag => (
                          <button
                            key={tag.id}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              onAddTag(lead.id, tag);
                              setShowTagMenu(null);
                            }}
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: tag.color }}
                            ></span>
                            {tag.name}
                          </button>
                        ))}
                        {tags.filter(tag => !lead.tags?.some(t => t.id === tag.id)).length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            All tags added
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
  
  // Saved Views state
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [newViewName, setNewViewName] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  
  // Tags state
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Hot Lead', color: '#ef4444' },
    { id: '2', name: 'Follow Up', color: '#3b82f6' },
    { id: '3', name: 'VIP', color: '#f59e0b' },
    { id: '4', name: 'New', color: '#10b981' }
  ]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagLeadId, setTagLeadId] = useState<number | null>(null);

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
  
  // Saved Views handlers
  useEffect(() => {
    // Load saved views and tags from API on component mount
    const loadSavedViewsAndTags = async () => {
      try {
        // In a real implementation, this would be API calls
        // const viewsResponse = await leadsAPI.getSavedViews();
        // setSavedViews(viewsResponse);
        
        // const tagsResponse = await leadsAPI.getTags();
        // setTags(tagsResponse);
        
        // For now, we'll use local storage for saved views
        const storedViews = localStorage.getItem('leadflowx-saved-views');
        if (storedViews) {
          try {
            const parsedViews = JSON.parse(storedViews);
            setSavedViews(parsedViews);
          } catch (error) {
            console.error('Failed to parse saved views:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load saved views or tags:', error);
      }
    };
    
    loadSavedViewsAndTags();
  }, []);

  const saveCurrentView = async () => {
    if (!newViewName.trim()) return;
    
    try {
      // In a real implementation, this would be an API call
      // const newView = await leadsAPI.createSavedView(newViewName.trim(), filters, sort);
      // setSavedViews(prev => [...prev, newView]);
      
      // For now, we'll use local storage
      const newView: SavedView = {
        id: Date.now().toString(),
        name: newViewName.trim(),
        filters: { ...filters },
        sort: { ...sort }
      };
      
      const updatedViews = [...savedViews, newView];
      setSavedViews(updatedViews);
      
      // Save to local storage
      localStorage.setItem('leadflowx-saved-views', JSON.stringify(updatedViews));
      
      setNewViewName('');
      setIsViewModalOpen(false);
    } catch (error) {
      console.error('Failed to save view:', error);
    }
  };
  
  const deleteView = async (id: string) => {
    try {
      // In a real implementation, this would be an API call
      // await leadsAPI.deleteSavedView(id);
      
      // For now, we'll use local storage
      const updatedViews = savedViews.filter(view => view.id !== id);
      setSavedViews(updatedViews);
      localStorage.setItem('leadflowx-saved-views', JSON.stringify(updatedViews));
      
      if (selectedViewId === id) {
        setSelectedViewId(null);
      }
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  };
  
  const applyView = (view: SavedView) => {
    setFilters(view.filters);
    setSort(view.sort);
    setSelectedViewId(view.id);
  };
  
  // Tags handlers
  const handleAddTag = async (leadId: number, tag: Tag) => {
    try {
      // In a real implementation, this would call an API
      // await leadsAPI.addTag(leadId, tag.id);
      
      // For now, we'll update the local state
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            tags: [...(lead.tags || []), tag]
          };
        }
        return lead;
      }));
      
      setTagLeadId(null);
      setShowTagPicker(false);
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };
  
  const handleRemoveTag = async (leadId: number, tagId: string) => {
    try {
      // In a real implementation, this would call an API
      // await leadsAPI.removeTag(leadId, tagId);
      
      // For now, we'll update the local state
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            tags: (lead.tags || []).filter(tag => tag.id !== tagId)
          };
        }
        return lead;
      }));
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };
  
  const openTagPicker = (leadId: number) => {
    setTagLeadId(leadId);
    setShowTagPicker(true);
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
        {selectedLead ? (
          <LeadDetail 
            lead={selectedLead}
            onBack={() => setSelectedLead(null)}
            onUpdate={handleLeadUpdate}
          />
        ) : (
          <>
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
          </>
        )}

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium">Filters</h3>
                <div className="relative">
                  <div className="flex space-x-2">
                    <select
                      value={selectedViewId || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const view = savedViews.find(v => v.id === e.target.value);
                          if (view) applyView(view);
                        } else {
                          setSelectedViewId(null);
                        }
                      }}
                      className="select"
                    >
                      <option value="">Select saved view</option>
                      {savedViews.map(view => (
                        <option key={view.id} value={view.id}>
                          {view.name}
                        </option>
                      ))}
                    </select>
                    
                    {selectedViewId && (
                      <button
                        onClick={() => deleteView(selectedViewId)}
                        className="btn btn-danger btn-sm"
                        title="Delete this view"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsViewModalOpen(true)}
                  className="btn btn-primary btn-sm inline-flex items-center"
                >
                  <BookmarkIcon className="h-4 w-4 mr-1" />
                  Save Current View
                </button>
              </div>
            </div>
            
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <select
                  value={filters.tags?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    tags: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
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
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          tags={tags}
        />

        <BulkActions
          selectedItems={selectedLeads.map(String)}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          onReassign={() => console.log('Reassign action triggered')}
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
        
        {/* Save View Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Save Current View
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Save your current filters and sorting options for quick access later.
                        </p>
                        <div className="mt-4">
                          <label htmlFor="viewName" className="block text-sm font-medium text-gray-700">
                            View Name
                          </label>
                          <input
                            type="text"
                            id="viewName"
                            className="input mt-1 w-full"
                            value={newViewName}
                            onChange={(e) => setNewViewName(e.target.value)}
                            placeholder="Enter a name for this view"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn btn-primary sm:ml-3"
                    onClick={saveCurrentView}
                    disabled={!newViewName.trim()}
                  >
                    Save View
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setNewViewName('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tag Picker Modal */}
        {showTagPicker && tagLeadId !== null && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add Tags
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Select tags to add to this lead
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {tags.map(tag => (
                            <button
                              key={tag.id}
                              className="flex items-center p-2 border rounded hover:bg-gray-50"
                              onClick={() => handleAddTag(tagLeadId, tag)}
                            >
                              <span
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: tag.color }}
                              ></span>
                              <span>{tag.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowTagPicker(false);
                      setTagLeadId(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
