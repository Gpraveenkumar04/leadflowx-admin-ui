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
import { Lead, LeadFilters, TableSort, QAStatus, DATA_SOURCES, Tag, SavedView } from '../src/types';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx } from 'clsx';
import { Button, Badge, Modal } from '@/design-system/components';
import BulkActions from '../src/components/BulkActions';

// SavedView & Tag now imported from central types

interface LeadTableProps {
  onAddTag: (leadId: number, tagId: string) => void;
  onRemoveTag: (leadId: number, tagId: string) => void;
  tags: Tag[];
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  onLeadUpdate: (lead: Lead) => void;
  selectedLeads: number[];
  onSelectLead: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  sort: TableSort;
  setSort: (s: TableSort) => void;
  loading: boolean;
  hasMore: boolean;
  onEndReached: () => void;
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
  sort,
  setSort,
  loading,
  hasMore,
  onEndReached
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
    if (score === undefined || score === null) return <span className="badge badge-secondary">-</span>;
    const intent: 'success' | 'warning' | 'danger' = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger';
    return <span className={`badge badge-${intent}`}>{score}</span>;
  };

  const parentRef = useRef<HTMLDivElement | null>(null);
  // Infinite scroll trigger
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    let ticking = false;
    const debounce = (fn: () => void, ms: number) => {
      let t: any; return () => { clearTimeout(t); t = setTimeout(fn, ms); };
    };
    const handle = () => {
      if (!el || loading || !hasMore) return;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (nearBottom) onEndReached();
    };
    const debounced = debounce(handle, 120);
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; debounced(); }); } };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [loading, hasMore, onEndReached]);

  // Intersection Observer sentinel alternative (last row)
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) onEndReached(); });
    }, { root: parentRef.current, rootMargin: '0px 0px 300px 0px' });
    if (endRef.current) observer.observe(endRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onEndReached]);
  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 8
  });

  const toggleSort = (field: string) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-y-auto max-h-[70vh]" ref={parentRef}>
        <table className="table">
          <thead className="table-header sticky top-0 z-10">
            <tr>
              <th className="table-header-cell w-4">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="input-checkbox"
                />
              </th>
              {['company','name','email','phone','website','source','scrapedAt','auditScore','qaStatus','leadScore'].map(col => (
                <th key={col} className="table-header-cell cursor-pointer select-none" onClick={() => toggleSort(col)}>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{col.replace(/([A-Z])/g,' $1')}</span>
                    {sort.field === col && (
                      <span className="text-[10px] text-[var(--color-text-subtle)]">{sort.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="table-header-cell">Tags</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body relative" style={{ height: rowVirtualizer.getTotalSize() }}>
            {rowVirtualizer.getVirtualItems().map(vRow => {
              const lead = leads[vRow.index];
              return (
                <tr key={lead.id} className="hover:bg-[var(--color-bg-subtle)] absolute left-0 right-0 transition-colors" style={{ transform: `translateY(${vRow.start}px)` }}>
                <td className="table-cell">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onSelectLead(lead.id)}
                    className="input-checkbox"
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
                      <button onClick={() => handleSave(lead)} className="text-[var(--color-success-600)] hover:text-[var(--color-success-700)]">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-[var(--color-danger-600)] hover:text-[var(--color-danger-700)]">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded"
                      onClick={() => handleEdit(lead.id, 'company', lead.company)}
                    >
                      <div className="text-sm font-medium text-[var(--color-text)]">{lead.company}</div>
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
                      <button onClick={() => handleSave(lead)} className="text-[var(--color-success-600)] hover:text-[var(--color-success-700)]">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancel} className="text-[var(--color-danger-600)] hover:text-[var(--color-danger-700)]">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded"
                      onClick={() => handleEdit(lead.id, 'name', lead.name)}
                    >
                      <div className="text-sm text-[var(--color-text)]">{lead.name}</div>
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  <div className="text-sm text-[var(--color-text)]">{lead.email}</div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--color-text)]">{lead.phone}</span>
                    <button
                      onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                      className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
                      title="Click to call"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--color-text)] truncate max-w-32">{lead.website}</span>
                    <button
                      onClick={() => window.open(lead.website, '_blank')}
                      className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
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
                  <div className="text-sm text-[var(--color-text-muted)]">
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
                      <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                        {tag.name}
                        <button onClick={() => onRemoveTag(lead.id, tag.id)} className="ml-1 text-xs hover:opacity-70">
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <button onClick={() => setShowTagMenu(lead.id)} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]">
                      <TagIcon className="h-4 w-4" />
                    </button>
                    {showTagMenu === lead.id && (
                      <div className="absolute mt-8 z-20 w-48 bg-[var(--color-bg-surface)] rounded-md shadow-lg py-1 ring-1 ring-[var(--color-border)]">
                        {tags.filter(tag => !lead.tags?.some(t => t.id === tag.id)).map(tag => (
                          <button key={tag.id} className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]" onClick={() => { onAddTag(lead.id, tag.id); setShowTagMenu(null); }}>
                            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }}></span>
                            {tag.name}
                          </button>
                        ))}
                        {tags.filter(tag => !lead.tags?.some(t => t.id === tag.id)).length === 0 && (
                          <div className="px-4 py-2 text-sm text-[var(--color-text-muted)]">All tags added</div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLeadSelect(lead)}
                      className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(lead.correlationId)}
                      className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                      title="Copy correlation ID"
                    >
                      <span className="text-xs font-mono">ID</span>
                    </button>
                  </div>
                </td>
                </tr>
              );
            })}
            {loading && hasMore && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="absolute left-0 right-0 animate-pulse" style={{ transform: `translateY(${rowVirtualizer.getTotalSize() + i * 52}px)` }}>
                  <td colSpan={13} className="px-4 py-3">
                    <div className="flex space-x-4">
                      <div className="h-4 w-8 bg-[var(--color-bg-subtle)] rounded" />
                      <div className="h-4 w-24 bg-[var(--color-bg-subtle)] rounded" />
                      <div className="h-4 w-32 bg-[var(--color-bg-subtle)] rounded" />
                      <div className="h-4 w-20 bg-[var(--color-bg-subtle)] rounded" />
                      <div className="h-4 w-40 bg-[var(--color-bg-subtle)] rounded" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {hasMore && (
          <div ref={endRef} className="py-4 text-center text-sm text-[var(--color-text-muted)]">
            {loading ? 'Loading more leads…' : 'Scroll to load more'}
          </div>
        )}
      </div>
    </div>
  );
};

export default function LeadsPage() {
  const { leads, loading, pagination, filters, sort, setFilters, setSort, setPage, updateLeadOptimistic, bulkApprove, bulkReject, tags, addTag, removeTag, createTag, syncPendingTags, savedViews, saveView, deleteView, applyView, activeViewId } = useLeadsData();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  // pagination/filters/sort now managed by hook
  
  const [newViewName, setNewViewName] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagLeadId, setTagLeadId] = useState<number | null>(null);
  // Aggregated list for infinite scroll
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const lastDepsRef = useRef<{ filters: string; sort: string } | null>(null);
  useEffect(() => {
    const filtersStr = JSON.stringify(filters);
    const sortStr = JSON.stringify(sort);
    const depsChanged = !lastDepsRef.current || lastDepsRef.current.filters !== filtersStr || lastDepsRef.current.sort !== sortStr;
    if (pagination.page === 1 && depsChanged) {
      setAllLeads(leads);
      lastDepsRef.current = { filters: filtersStr, sort: sortStr };
    } else if (pagination.page > 1) {
      setAllLeads(prev => {
        const existing = new Set(prev.map(l => l.id));
        const merged = [...prev];
        leads.forEach(l => { if (!existing.has(l.id)) merged.push(l); });
        return merged;
      });
    } else if (pagination.page === 1 && !depsChanged) {
      // page reset but same deps, replace
      setAllLeads(leads);
    }
  }, [leads, pagination.page, filters, sort]);
  const hasMore = pagination.page < pagination.totalPages;
  const handleEndReached = () => { if (!loading && hasMore) setPage(pagination.page + 1); };

  const handleLeadUpdate = async (updatedLead: Lead) => { try { await updateLeadOptimistic(updatedLead.id, updatedLead); } catch (e) { console.error('Failed to update lead:', e); } };

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

  const handleBulkApprove = async () => { try { await bulkApprove(selectedLeads); setSelectedLeads([]); } catch (e) { console.error('Failed bulk approve', e);} };
  const handleBulkReject = async () => { try { await bulkReject(selectedLeads, 'Bulk rejection'); setSelectedLeads([]); } catch (e) { console.error('Failed bulk reject', e);} };

  const handleExport = async () => {
    try {
  const blob = await leadsAPI.exportLeads(filters); // still using direct API for export
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
  // saved views & tags now loaded via hook

  const saveCurrentView = async () => { const v = await saveView(newViewName); if (v) { setNewViewName(''); setIsViewModalOpen(false);} };
  
  // Tags handlers
  const handleAddTag = async (leadId: number, tagId: string) => { try { await addTag(leadId, tagId); } catch (e) { console.error('add tag failed', e);} };
  const handleRemoveTag = async (leadId: number, tagId: string) => { try { await removeTag(leadId, tagId); } catch (e) { console.error('remove tag failed', e);} };
  // Tag creation
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await createTag(newTagName.trim(), newTagColor);
      if (tagLeadId) await addTag(tagLeadId, tag.id);
      setNewTagName('');
    } catch (e) { console.error('create tag failed', e);} };
  
  const openTagPicker = (leadId: number) => {
    setTagLeadId(leadId);
    setShowTagPicker(true);
  };

  if (loading && pagination.page === 1) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[var(--color-bg-subtle)] rounded w-1/3"></div>
          <div className="h-24 bg-[var(--color-bg-subtle)] rounded"></div>
          <div className="h-96 bg-[var(--color-bg-subtle)] rounded"></div>
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
                <h2 className="text-2xl font-bold leading-7 text-[var(--color-text)] sm:text-3xl sm:truncate">
                  Lead Management
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Manage and review your lead database
                </p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
                {selectedLeads.length > 0 && (
                  <>
                    <Button variant="primary" size="sm" onClick={handleBulkApprove}>
                      Approve Selected ({selectedLeads.length})
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleBulkReject}>
                      Reject Selected
                    </Button>
                  </>
                )}
                <Button variant="secondary" size="sm" onClick={handleExport} leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}>Export CSV</Button>
                  {tags.some(t => t.pending) && (
                    <Button variant="secondary" size="sm" onClick={async () => { await syncPendingTags(); }} className="relative">
                      <span className="absolute inline-flex h-2 w-2 top-0 right-0 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-warning-400)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-warning-500)]"></span>
                      </span>
                      Sync Pending Tags ({tags.filter(t => t.pending).length})
                    </Button>
                  )}
              </div>
            </div>
          </>
        )}

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-[var(--color-text)]">Filters</h3>
                <div className="relative">
                  <div className="flex space-x-2">
                    <select
                      value={activeViewId || ''}
                      onChange={(e) => applyView(e.target.value || '')}
                      className="select"
                    >
                      <option value="">Select saved view</option>
                      {savedViews.map(view => (
                        <option key={view.id} value={view.id}>
                          {view.name}
                        </option>
                      ))}
                    </select>
                    
                    {activeViewId && (
                      <button
                        onClick={() => deleteView(activeViewId)}
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
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Search</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="input pl-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Source</label>
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
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">QA Status</label>
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
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Date Range</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">Tags</label>
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
                        {tag.name}{tag.pending ? ' (pending)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <LeadTable
          leads={allLeads}
          onLeadSelect={setSelectedLead}
          onLeadUpdate={handleLeadUpdate}
          selectedLeads={selectedLeads}
          onSelectLead={handleSelectLead}
          onSelectAll={handleSelectAll}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          tags={tags}
          sort={sort}
          setSort={setSort}
          loading={loading}
          hasMore={hasMore}
          onEndReached={handleEndReached}
        />

        <BulkActions
          selectedItems={selectedLeads.map(String)}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          onReassign={() => console.log('Reassign action triggered')}
        />

        {/* Pagination status (infinite scroll active) */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <button
              disabled={!hasMore}
              onClick={() => setPage(pagination.page + 1)}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing{' '}
                <span className="font-medium text-[var(--color-text)]">
                  {allLeads.length > 0 ? 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-medium text-[var(--color-text)]">
                  {allLeads.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--color-text)]">{pagination.total}</span>{' '}
                results
              </p>
              {hasMore && (
                <p className="text-xs text-[var(--color-text-subtle)]">Scroll to load more (page {pagination.page} / {pagination.totalPages})</p>
              )}
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="btn btn-secondary btn-sm rounded-l-md"
                >
                  Previous
                </button>
                <button
                  disabled={!hasMore}
                  onClick={() => setPage(pagination.page + 1)}
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
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true"></div>
              <div className="relative card w-full max-w-lg">
                <div className="card-header">
                  <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">
                    Save Current View
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Save your current filters and sorting options for quick access later.
                  </p>
                  <div className="mt-4">
                    <label htmlFor="viewName" className="block text-sm font-medium text-[var(--color-text-muted)]">
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
                <div className="card-footer bg-[var(--color-bg-subtle)] flex justify-end space-x-3">
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveCurrentView}
                    disabled={!newViewName.trim()}
                  >
                    Save View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tag Picker Modal */}
        {showTagPicker && tagLeadId !== null && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true"></div>
              <div className="relative card w-full max-w-lg">
                <div className="card-header">
                  <h3 className="text-lg leading-6 font-medium text-[var(--color-text)]">
                    Add Tags
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Select tags to add to this lead
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        className="flex items-center p-2 border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-subtle)]"
                        onClick={() => handleAddTag(tagLeadId, tag.id)}
                      >
                        <span
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        <span className="text-[var(--color-text)]">{tag.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-[var(--color-border)] pt-4 text-left">
                    <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Create New Tag</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        className="input flex-1 py-1 px-2 text-sm"
                      />
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="h-8 w-10 p-0 border border-[var(--color-border)] rounded bg-[var(--color-bg-surface)]"
                      />
                      <button
                        disabled={!newTagName.trim()}
                        onClick={handleCreateTag}
                        className="btn btn-primary btn-sm"
                      >Create</button>
                    </div>
                    <p className="text-xs text-[var(--color-text-subtle)]">Creating will auto-assign to this lead.</p>
                  </div>
                </div>
                <div className="card-footer bg-[var(--color-bg-subtle)] flex justify-end">
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
