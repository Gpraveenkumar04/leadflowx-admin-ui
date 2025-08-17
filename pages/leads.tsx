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
import { t } from '../src/i18n';
import { leadsAPI } from '../src/services/api';
import { Lead, LeadFilters, TableSort, QAStatus, DATA_SOURCES, Tag, SavedView } from '../src/types';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx } from 'clsx';
import { Button, Badge, Modal } from '@/design-system/components';
import BulkActions from '../src/components/BulkActions';
import LeadTable from '../components/leads/LeadTable';

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

// LeadTable extracted to components/leads/LeadTable.tsx

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
  const filename = t('download.leads_filename');
  a.download = filename;
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
                  {t('nav.leads')}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {t('leads.manage_subtitle')}
                </p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
                {selectedLeads.length > 0 && (
                  <>
                    <Button variant="primary" size="sm" onClick={handleBulkApprove}>
                      {t('lead.actions.approve_selected', { n: selectedLeads.length })}
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleBulkReject}>
                      {t('lead.actions.reject_selected')}
                    </Button>
                  </>
                )}
                <Button variant="secondary" size="sm" onClick={handleExport} leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}>{t('lead.action.export_csv')}</Button>
                  {tags.some(t => t.pending) && (
                    <Button variant="secondary" size="sm" onClick={async () => { await syncPendingTags(); }} className="relative">
                      <span className="absolute inline-flex h-2 w-2 top-0 right-0 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-warning-400)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-warning-500)]"></span>
                      </span>
                      {t('leads.sync_pending_tags', { n: tags.filter(t => t.pending).length })}
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
                <h3 className="text-lg font-medium text-[var(--color-text)]">{t('leads.filters.title')}</h3>
                <div className="relative">
                  <div className="flex space-x-2">
                    <select
                      value={activeViewId || ''}
                      onChange={(e) => applyView(e.target.value || '')}
                      className="select"
                    >
                      <option value="">{t('leads.views.select_saved')}</option>
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
                        title={t('leads.views.delete_title')}
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
                  {t('leads.views.save_current')}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
        <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('leads.filters.search_label')}</label>
                <div className="mt-1 relative">
                  <input
          type="text"
          placeholder={t('leads.filters.search_placeholder')}
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="input pl-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('leads.filters.source_label')}</label>
                <select
                  value={filters.source?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    source: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">{t('leads.filters.all_sources')}</option>
                  {DATA_SOURCES.map(source => (
                    <option key={source} value={source}>
                      {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('leads.filters.qa_label')}</label>
                <select
                  value={filters.qaStatus?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    qaStatus: e.target.value ? [e.target.value as QAStatus] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">{t('leads.filters.all_statuses')}</option>
                  <option value="pending">{t('workflow.pending')}</option>
                  <option value="approved">{t('lead.qa.approved')}</option>
                  <option value="rejected">{t('lead.qa.rejected')}</option>
                  <option value="needs_review">{t('lead.qa.needs_review')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('leads.filters.date_label')}</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)]">{t('leads.filters.tags_label')}</label>
                <select
                  value={filters.tags?.[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    tags: e.target.value ? [e.target.value] : undefined 
                  }))}
                  className="select mt-1"
                >
                  <option value="">{t('leads.filters.all_tags')}</option>
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
              {t('actions.previous')}
            </button>
            <button
              disabled={!hasMore}
              onClick={() => setPage(pagination.page + 1)}
              className="btn btn-secondary btn-sm"
            >
              {t('actions.next')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t('leads.pagination.showing')} {' '}
                <span className="font-medium text-[var(--color-text)]">
                  {allLeads.length > 0 ? 1 : 0}
                </span>{' '}
                {t('leads.pagination.to')} {' '}
                <span className="font-medium text-[var(--color-text)]">
                  {allLeads.length}
                </span>{' '}
                {t('leads.pagination.of')} {' '}
                <span className="font-medium text-[var(--color-text)]">{pagination.total}</span>{' '}
                {t('leads.pagination.results')}
              </p>
              {hasMore && (
                <p className="text-xs text-[var(--color-text-subtle)]">{t('leads.scroll_to_load', { page: pagination.page, totalPages: pagination.totalPages })}</p>
              )}
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="btn btn-secondary btn-sm rounded-l-md"
                >
                  {t('actions.previous')}
                </button>
                <button
                  disabled={!hasMore}
                  onClick={() => setPage(pagination.page + 1)}
                  className="btn btn-secondary btn-sm rounded-r-md"
                >
                  {t('actions.next')}
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
                    {t('leads.views.modal.title')}
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {t('leads.views.modal.desc')}
                  </p>
                  <div className="mt-4">
                    <label htmlFor="viewName" className="block text-sm font-medium text-[var(--color-text-muted)]">
                      {t('leads.views.modal.name_label')}
                    </label>
                    <input
                      type="text"
                      id="viewName"
                      className="input mt-1 w-full"
                      value={newViewName}
                      onChange={(e) => setNewViewName(e.target.value)}
                      placeholder={t('leads.views.modal.name_placeholder')}
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
                    {t('actions.cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveCurrentView}
                    disabled={!newViewName.trim()}
                  >
                    {t('leads.views.modal.save')}
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
                    {t('leads.tags.modal.title')}
                  </h3>
                </div>
                <div className="card-body">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {t('leads.tags.modal.desc')}
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
                    <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">{t('leads.tags.create.title')}</h4>
                     <div className="flex items-center gap-2 mb-3">
                       <input
                         type="text"
                         value={newTagName}
                         onChange={(e) => setNewTagName(e.target.value)}
                         placeholder={t('leads.tags.create.placeholder')}
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
                       >{t('actions.create')}</button>
                     </div>
                    <p className="text-xs text-[var(--color-text-subtle)]">{t('leads.tags.create.hint')}</p>
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
                    {t('actions.close')}
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
