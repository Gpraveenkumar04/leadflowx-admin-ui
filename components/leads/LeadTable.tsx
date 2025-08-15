import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon, XMarkIcon, PhoneIcon, ArrowTopRightOnSquareIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline';
import { Lead, QAStatus, Tag } from '../../src/types';

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
  sort: any;
  setSort: (s: any) => void;
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

  const parentRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

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
                  <div
                    className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded"
                    onClick={() => setEditingField({ id: lead.id, field: 'company' })}
                  >
                    <div className="text-sm font-medium text-[var(--color-text)]">{lead.company}</div>
                  </div>
                </td>
                <td className="table-cell">
                  <div
                    className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded"
                    onClick={() => setEditingField({ id: lead.id, field: 'name' })}
                  >
                    <div className="text-sm text-[var(--color-text)]">{lead.name}</div>
                  </div>
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

export default LeadTable;
