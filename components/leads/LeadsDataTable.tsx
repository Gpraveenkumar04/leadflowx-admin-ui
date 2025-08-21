import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PhoneIcon, ArrowTopRightOnSquareIcon, EyeIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Lead, QAStatus, Tag } from '@/types';
import { t } from '@/i18n';
import { DataTable, createSortableColumn, createStatusColumn, Badge, Button } from '@/design-system/components';

interface LeadsDataTableProps {
  leads: Lead[];
  tags: Tag[];
  onLeadSelect: (lead: Lead) => void;
  onLeadUpdate: (lead: Lead) => void;
  onAddTag: (leadId: number, tagId: string) => void;
  onRemoveTag: (leadId: number, tagId: string) => void;
  onSelectionChange?: (selectedLeads: Lead[]) => void;
  loading?: boolean;
}

const qaStatusMap = {
  approved: { label: t('lead.qa.approved'), variant: 'success' as const },
  rejected: { label: t('lead.qa.rejected'), variant: 'danger' as const },
  needs_review: { label: t('lead.qa.needs_review'), variant: 'warning' as const },
  pending: { label: t('lead.qa.pending'), variant: 'secondary' as const },
};

export function LeadsDataTable({
  leads,
  tags,
  onLeadSelect,
  onLeadUpdate,
  onAddTag,
  onRemoveTag,
  onSelectionChange,
  loading = false,
}: LeadsDataTableProps) {
  const getScoreBadge = (score?: number) => {
    if (score === undefined || score === null) return <Badge variant="secondary">-</Badge>;
    const variant: 'success' | 'warning' | 'danger' = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger';
    return <Badge variant={variant}>{score}</Badge>;
  };

  const columns: ColumnDef<Lead>[] = [
    createSortableColumn('company', t('lead.table.company'), (value, lead) => (
      <div
        className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded -mx-2"
        onClick={() => onLeadUpdate({ ...lead, company: value as string })}
      >
        <div className="text-sm font-medium text-[var(--color-text)]">{value}</div>
      </div>
    )),
    
    createSortableColumn('name', t('lead.table.name'), (value, lead) => (
      <div
        className="cursor-pointer hover:bg-[var(--color-bg-inset)] px-2 py-1 rounded -mx-2"
        onClick={() => onLeadUpdate({ ...lead, name: value as string })}
      >
        <div className="text-sm text-[var(--color-text)]">{value}</div>
      </div>
    )),
    
    createSortableColumn('email', t('lead.table.email'), (value) => (
      <div className="text-sm text-[var(--color-text)]">{value}</div>
    )),
    
    createSortableColumn('phone', t('lead.table.phone'), (value) => (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-[var(--color-text)]">{value}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`tel:${value}`, '_self')}
          className="h-6 w-6 p-0"
          title={t('lead.action.call')}
        >
          <PhoneIcon className="h-4 w-4" />
        </Button>
      </div>
    )),
    
    createSortableColumn('website', t('lead.table.website'), (value) => (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-[var(--color-text)] truncate max-w-32">{value}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(value as string, '_blank')}
          className="h-6 w-6 p-0"
          title={t('lead.action.open_website')}
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Button>
      </div>
    )),
    
    createSortableColumn('source', t('lead.table.source'), (value) => (
      <Badge variant="primary">{value || t('lead.unknown_source')}</Badge>
    )),
    
    createSortableColumn('scrapedAt', t('lead.table.scraped_at'), (value) => (
      <div className="text-sm text-[var(--color-text-muted)]">
        {value ? new Date(value as string).toLocaleDateString() : '-'}
      </div>
    )),
    
    createSortableColumn('auditScore', t('lead.table.audit_score'), (value) => getScoreBadge(value as number)),
    
    createStatusColumn('qaStatus', t('lead.table.qa_status'), qaStatusMap),
    
    createSortableColumn('leadScore', t('lead.table.lead_score'), (value) => getScoreBadge(value as number)),
    
    {
      accessorKey: 'tags',
      header: t('lead.labels.tags'),
      cell: ({ row }) => {
        const lead = row.original;
        const [showTagMenu, setShowTagMenu] = React.useState(false);
        
        return (
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
                  className="ml-1 text-xs hover:opacity-70"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTagMenu(!showTagMenu)}
              className="h-6 w-6 p-0"
              title="Add tag"
            >
              <TagIcon className="h-4 w-4" />
            </Button>
            {showTagMenu && (
              <div className="absolute mt-8 z-20 w-48 bg-[var(--color-bg-surface)] rounded-md shadow-lg py-1 ring-1 ring-[var(--color-border)]">
                {tags.filter(tag => !lead.tags?.some(existing => existing.id === tag.id)).map(tag => (
                  <button 
                    key={tag.id} 
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]" 
                    onClick={() => { onAddTag(lead.id, tag.id); setShowTagMenu(false); }}
                  >
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }}></span>
                    {tag.name}
                  </button>
                ))}
                {tags.filter(tag => !lead.tags?.some(existing => existing.id === tag.id)).length === 0 && (
                  <div className="px-4 py-2 text-sm text-[var(--color-text-muted)]">{t('lead.tags.all_added')}</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    
    {
      accessorKey: 'actions',
      header: t('lead.action.actions'),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLeadSelect(lead)}
              className="h-6 w-6 p-0"
              title={t('lead.action.view_all')}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(lead.correlationId)}
              className="h-6 w-6 p-0"
              title={t('lead.action.copy_id')}
            >
              <span className="text-xs font-mono">ID</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={leads}
      loading={loading}
      searchable={true}
      filterable={true}
      selectable={true}
      onSelectionChange={onSelectionChange}
      className="w-full"
    />
  );
}
