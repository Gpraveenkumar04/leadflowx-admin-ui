import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeftIcon,
  PencilIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  LinkIcon,
  MapPinIcon,
  UserIcon,
  EllipsisVerticalIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { leadsAPI } from '../services/api';
import { Lead, Tag, QAStatus, User } from '../types';
import { AuditEvent as UIAuditEvent } from './AuditTrail';
import Comments, { Comment } from './Comments';
import AuditTrail from './AuditTrail';
import UserAssignment from './UserAssignment';
import WorkflowStatus from './WorkflowStatus';
import { clsx } from 'clsx';
import JsonTree from './JsonTree';
import { t } from '../i18n';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onUpdate: (lead: Lead) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [auditEvents, setAuditEvents] = useState<UIAuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'audit' | 'raw'>('details');
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [loading, setLoading] = useState({ comments: true, audit: true, saving: false });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<Lead['workflowStatus']>(lead.workflowStatus || 'pending');

  const availableUsersMemo = useMemo(() => availableUsers, [availableUsers]);

  const auditScoreColor = useMemo(() => {
    const score = lead.auditScore || 0;
    return score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  }, [lead.auditScore]);

  const leadScoreColor = useMemo(() => {
    const score = lead.leadScore || 0;
    return score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  }, [lead.leadScore]);

  useEffect(() => {
    fetchComments();
    fetchAuditTrail();
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users`);
        if (res.ok) {
          const data = await res.json();
          setAvailableUsers(Array.isArray(data?.data) ? data.data : []);
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  const fetchComments = async () => {
    setLoading(prev => ({ ...prev, comments: true }));
    try {
      const data = await leadsAPI.getComments(lead.id);
      const mapped = (data || []).map((c: any) => ({
        id: c.id || `${c.timestamp || Date.now()}`,
        text: c.text || c.content || '',
        userId: c.author?.id || c.userId || '',
        userName: c.author?.name || c.userName || 'User',
        timestamp: c.timestamp || c.createdAt || new Date().toISOString(),
        mentions: c.mentions || [],
        userAvatar: c.author?.avatar,
      }));
      setComments(mapped);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  const fetchAuditTrail = async () => {
    setLoading(prev => ({ ...prev, audit: true }));
    try {
      const data = await leadsAPI.getAuditTrail(lead.id);
      const mapped = (data || []).map((e: any) => ({
        id: e.id || `${e.timestamp || Date.now()}`,
        eventType: e.action || e.eventType || 'update',
        entityId: lead.id,
        entityType: 'lead' as const,
        userId: e.user?.id || e.userId || '',
        userName: e.user?.name || e.userName || 'User',
        userAvatar: e.user?.avatar,
        timestamp: e.timestamp || e.createdAt || new Date().toISOString(),
        changes: e.changes || e.diff || undefined,
        metadata: e.metadata || undefined,
      }));
      setAuditEvents(mapped);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
    } finally {
      setLoading(prev => ({ ...prev, audit: false }));
    }
  };

  const handleAddComment = useCallback(async (text: string, mentions: string[]) => {
    try {
      await leadsAPI.addComment(lead.id, text, mentions);
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, [lead.id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      await leadsAPI.deleteComment(lead.id, commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }, [lead.id]);

  const startEditing = () => {
    setFormData({ ...lead });
    setEditing(true);
  };

  const cancelEditing = () => {
    setFormData({});
    setEditing(false);
  };

  const saveChanges = async () => {
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      const changedFields = Object.keys(formData).filter(key => formData[key as keyof Lead] !== lead[key as keyof Lead]);
      if (changedFields.length === 0) {
        cancelEditing();
        return;
      }
      const updatedLead = { ...lead, ...formData };
      await onUpdate(updatedLead);
      setEditing(false);
      setFormData({});
      fetchAuditTrail();
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQAStatusChange = (status: QAStatus) => {
    if (!editing) return;
    setFormData(prev => ({ ...prev, qaStatus: status }));
  };

  const handleWorkflowStatusChange = useCallback((status: Lead['workflowStatus']) => {
    setWorkflowStatus(status);
    setFormData(prev => ({ ...prev, workflowStatus: status }));
  const newAuditEvent: UIAuditEvent = {
      id: `temp-${Date.now()}`,
      eventType: 'update',
      entityId: lead.id,
      entityType: 'lead',
      userId: '1',
      userName: 'Current User',
      timestamp: new Date().toISOString(),
      changes: [{ field: 'workflowStatus', oldValue: lead.workflowStatus || 'pending', newValue: status }],
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);
  }, [lead.id, lead.workflowStatus]);

  const handleAssignUser = useCallback((userId: string) => {
    const selectedUser = availableUsers.find(user => user.id === userId);
    const userName = selectedUser ? selectedUser.name : 'Unassigned';
    setFormData(prev => ({ ...prev, assigneeId: userId || undefined }));
  const newAuditEvent: UIAuditEvent = {
      id: `temp-${Date.now()}`,
      eventType: 'update',
      entityId: lead.id,
      entityType: 'lead',
      userId: '1',
      userName: 'Current User',
      timestamp: new Date().toISOString(),
      changes: [{ field: 'assignee', oldValue: lead.assigneeId ? availableUsers.find(u => u.id === lead.assigneeId)?.name || 'Unknown' : 'Unassigned', newValue: userName }],
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);
  }, [lead.id, lead.assigneeId, availableUsers]);

  const getQAStatusIcon = (status?: QAStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      case 'needs_review':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm rounded-lg px-4 py-3 mb-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center">
            <button onClick={onBack} className="btn btn-ghost hover:bg-gray-100 p-2 rounded-full mr-3" aria-label={t('lead.action.back')}>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{t('lead.action.back')}</span>
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {editing ? (
                  <input type="text" name="company" value={formData.company || ''} onChange={handleInputChange} className="input focus:ring-primary-500 font-bold text-xl" placeholder={t('lead.placeholder.company')} aria-label={t('lead.placeholder.company')} required />
                ) : (
                  <span className="truncate max-w-[200px] sm:max-w-[400px]">{lead.company}</span>
                )}
                <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-md" title="Lead ID">ID: {lead.correlationId?.slice(0, 8)}</span>
              </h1>

              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="flex items-center mr-3">
                  <MapPinIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                  {lead.source || t('lead.unknown_source')}
                </span>
                {lead.scrapedAt && (
                  <span className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                    <time dateTime={lead.scrapedAt}>{new Date(lead.scrapedAt).toLocaleDateString()}</time>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            {lead.tags && lead.tags.length > 0 && !editing && (
              <div className="hidden md:flex items-center flex-wrap gap-1 mr-2" aria-label={t('lead.labels.tags')}>
                {lead.tags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }} title={`Tag: ${tag.name}`}>
                    <TagIcon className="h-3 w-3 mr-1" aria-hidden="true" />{tag.name}
                  </span>
                ))}
              </div>
            )}

            {editing ? (
              <div className="flex gap-2">
                <button onClick={cancelEditing} className="btn btn-outline btn-sm" aria-label={t('lead.action.cancel')} disabled={loading.saving}>{t('lead.action.cancel')}</button>
                <button onClick={saveChanges} className={clsx('btn btn-primary btn-sm flex items-center gap-1', loading.saving && 'opacity-75 cursor-not-allowed')} aria-label={t('lead.action.save')} disabled={loading.saving}>
                  {loading.saving ? (<><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />{t('lead.action.saving')}</>) : t('lead.action.save_changes')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <WorkflowStatus currentStatus={workflowStatus || 'pending'} onStatusChange={handleWorkflowStatusChange} size="sm" aria-labelledby="workflow-status-label" />
                <button onClick={startEditing} className="btn btn-primary btn-sm flex items-center gap-1" aria-label={t('lead.edit')}>
                  <PencilIcon className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{t('lead.edit')}</span>
                </button>
                <div className="relative">
                  <button onClick={() => setActionsMenuOpen(!actionsMenuOpen)} className="btn btn-ghost btn-sm p-2 rounded-full" aria-label={t('lead.more_actions')} aria-expanded={actionsMenuOpen} aria-haspopup="true">
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {actionsMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setActionsMenuOpen(false); }}><DocumentDuplicateIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />{t('lead.action.duplicate')}</button>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setActionsMenuOpen(false); }}><ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />{t('lead.action.reaudit')}</button>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setActionsMenuOpen(false); }}><ChartBarIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />{t('lead.action.view_metrics')}</button>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => { setActionsMenuOpen(false); }}><XMarkIcon className="h-4 w-4 mr-2" aria-hidden="true" />{t('lead.action.delete')}</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label={t('lead.nav.sections')}>
            <button onClick={() => setActiveTab('details')} className={clsx('py-2 px-1 border-b-2 font-medium text-sm', activeTab === 'details' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')} aria-current={activeTab === 'details' ? 'page' : undefined}>{t('lead.nav.details')}</button>
            <button onClick={() => setActiveTab('comments')} className={clsx('py-2 px-1 border-b-2 font-medium text-sm flex items-center', activeTab === 'comments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')} aria-current={activeTab === 'comments' ? 'page' : undefined}>{t('lead.nav.comments')}{comments.length > 0 && <span className={clsx('ml-2 rounded-full px-2 py-0.5 text-xs font-medium', activeTab === 'comments' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600')}>{comments.length}</span>}</button>
            <button onClick={() => setActiveTab('audit')} className={clsx('py-2 px-1 border-b-2 font-medium text-sm', activeTab === 'audit' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')} aria-current={activeTab === 'audit' ? 'page' : undefined}>{t('lead.nav.audit')}</button>
            <button onClick={() => setActiveTab('raw')} className={clsx('py-2 px-1 border-b-2 font-medium text-sm', activeTab === 'raw' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')} aria-current={activeTab === 'raw' ? 'page' : undefined}>{t('lead.nav.raw')}</button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={clsx('lg:col-span-2 space-y-6', activeTab !== 'details' && 'order-2')}>
          {activeTab === 'details' && (
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200"><div className="card-body p-6">
              <h2 className="sr-only">{t('lead.sections.details')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">{t('lead.field.contact_name')}</label>
                    {editing ? <input id="contact-name" type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="input mt-1 w-full" aria-label={t('lead.field.contact_name')} /> : <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md"><UserIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" /><span id="contact-name" className="font-medium">{lead.name}</span></div>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('lead.field.email')}</label>
                    {editing ? <input id="email" type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="input mt-1 w-full" aria-label={t('lead.field.email')} autoComplete="email" /> : <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group"><EnvelopeIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" /><a href={`mailto:${lead.email}`} className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors" aria-label={`${t('lead.action.email')} ${lead.email}`}>{lead.email}</a></div>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('lead.field.phone')}</label>
                    {editing ? <input id="phone" type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="input mt-1 w-full" aria-label={t('lead.field.phone')} autoComplete="tel" pattern="[0-9+\- ]+" /> : <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group"><PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" /><a href={`tel:${lead.phone}`} className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors" aria-label={`${t('lead.action.call')} ${lead.phone}`}>{lead.phone}</a></div>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">{t('lead.field.website')}</label>
                    {editing ? <input id="website" type="url" name="website" value={formData.website || ''} onChange={handleInputChange} className="input mt-1 w-full" aria-label={t('lead.field.website')} placeholder={t('lead.placeholder.website')} autoComplete="url" /> : <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group"><LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" /><a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors flex items-center" aria-label={`${t('lead.action.visit_website')} ${lead.website}`}><span className="truncate max-w-[200px]">{lead.website}</span><ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1 flex-shrink-0" aria-hidden="true" /></a></div>}
                  </div>
                  <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-1" id="assigned-to-label">{t('lead.field.assigned_to')}</h3>
                    <UserAssignment currentAssigneeId={formData.assigneeId || lead.assigneeId} onAssign={handleAssignUser} label={t('lead.action.assign')} size="md" showLabel={false} aria-labelledby="assigned-to-label" />
                  </div>
                  <div className="lg:hidden">
                    <h3 className="block text-sm font-medium text-gray-700 mb-1" id="workflow-status-mobile-label">{t('lead.field.workflow_status')}</h3>
                    <WorkflowStatus currentStatus={workflowStatus || 'pending'} onStatusChange={handleWorkflowStatusChange} size="md" aria-labelledby="workflow-status-mobile-label" />
                  </div>
                  {lead.tags && lead.tags.length > 0 && !editing && (<div className="md:hidden mt-4"><h3 className="text-sm font-medium text-gray-700 mb-2">{t('lead.labels.tags')}</h3><div className="flex flex-wrap gap-1">{lead.tags.map(tag => (<span key={tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}><TagIcon className="h-3 w-3 mr-1" aria-hidden="true" />{tag.name}</span>))}</div></div>)}
                </div>
              </div>
            </div></div>
          )}

          {activeTab === 'comments' && (<div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200"><div className="card-body p-6"><Comments entityId={lead.id} entityType="lead" comments={comments} onAddComment={handleAddComment} onDeleteComment={handleDeleteComment} availableUsers={availableUsersMemo} loading={loading.comments} /></div></div>)}

          {activeTab === 'audit' && (<div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200"><div className="card-body p-6"><AuditTrail events={auditEvents} title={t('lead.sections.audit_history')} maxHeight="600px" /></div></div>)}

          {activeTab === 'raw' && (<div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200"><div className="card-body p-6"><h3 className="text-base font-medium text-gray-900 mb-4">{t('lead.sections.raw_debug')}</h3><div className="border rounded-md bg-gray-50 p-3 max-h-[600px] overflow-auto text-sm"><JsonTree data={lead} initiallyExpanded={2} /></div></div></div>)}
        </div>

        <aside className={clsx('space-y-6', activeTab !== 'details' && 'order-1')}>
          <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-900 flex items-center" id="qa-status-label">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                  {t('lead.labels.qa_status')}
                </h3>
                {lead.qaReviewedAt && (
                  <span className="text-xs text-gray-500">{new Date(lead.qaReviewedAt).toLocaleDateString()}</span>
                )}
              </div>

              <div className="space-y-2" role="radiogroup" aria-labelledby="qa-status-label">
                <button
                  className={clsx(
                    'flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                    editing && 'hover:bg-gray-100',
                    formData.qaStatus === 'approved' || lead.qaStatus === 'approved'
                      ? 'bg-green-50 border border-green-200 shadow-sm'
                      : 'border border-transparent'
                  )}
                  onClick={() => handleQAStatusChange('approved')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'approved' || lead.qaStatus === 'approved'}
                  aria-label={t('lead.action.approve')}
                  tabIndex={formData.qaStatus === 'approved' || lead.qaStatus === 'approved' ? 0 : -1}
                >
                  <CheckCircleIcon
                    className={clsx(
                      'h-5 w-5 mr-2',
                      formData.qaStatus === 'approved' || lead.qaStatus === 'approved' ? 'text-green-500' : 'text-gray-300'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{t('lead.qa.approved')}</span>
                </button>

                <button
                  className={clsx(
                    'flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                    editing && 'hover:bg-gray-100',
                    formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected'
                      ? 'bg-red-50 border border-red-200 shadow-sm'
                      : 'border border-transparent'
                  )}
                  onClick={() => handleQAStatusChange('rejected')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected'}
                  aria-label={t('lead.action.reject')}
                  tabIndex={formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected' ? 0 : -1}
                >
                  <XMarkIcon
                    className={clsx(
                      'h-5 w-5 mr-2',
                      formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected' ? 'text-red-500' : 'text-gray-300'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{t('lead.qa.rejected')}</span>
                </button>

                <button
                  className={clsx(
                    'flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                    editing && 'hover:bg-gray-100',
                    formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review'
                      ? 'bg-yellow-50 border border-yellow-200 shadow-sm'
                      : 'border border-transparent'
                  )}
                  onClick={() => handleQAStatusChange('needs_review')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review'}
                  aria-label={t('lead.action.mark_for_review')}
                  tabIndex={formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review' ? 0 : -1}
                >
                  <ExclamationCircleIcon
                    className={clsx(
                      'h-5 w-5 mr-2',
                      formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review' ? 'text-yellow-500' : 'text-gray-300'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{t('lead.qa.needs_review')}</span>
                </button>

                <div>
                  <button onClick={startEditing} className="btn btn-primary btn-sm flex items-center gap-1" aria-label={t('lead.edit')}>
                    <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{t('lead.edit')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1" id="audit-score-label">{t('lead.labels.audit_score')}</h3>
              <div className="flex items-end">
                <div className={clsx('text-3xl font-bold', auditScoreColor)} aria-labelledby="audit-score-label" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lead.auditScore || 0} role="meter">
                  {lead.auditScore || 0}
                </div>
                <span className="text-xs text-gray-500 ml-1 mb-1">/100</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className={clsx('h-2 rounded-full', (lead.auditScore || 0) >= 80 ? 'bg-green-500' : (lead.auditScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${lead.auditScore || 0}%` }} />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1" id="lead-score-label">{t('lead.labels.lead_score')}</h3>
              <div className="flex items-end">
                <div className={clsx('text-3xl font-bold', leadScoreColor)} aria-labelledby="lead-score-label" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lead.leadScore || 0} role="meter">
                  {lead.leadScore || 0}
                </div>
                <span className="text-xs text-gray-500 ml-1 mb-1">/100</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className={clsx('h-2 rounded-full', (lead.leadScore || 0) >= 80 ? 'bg-green-500' : (lead.leadScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${lead.leadScore || 0}%` }} />
              </div>
            </div>
          </div>

          {lead.tags && lead.tags.length > 0 && !editing && (
            <div className="hidden md:block card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="card-body p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-900 flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                    {t('lead.labels.tags')}
                  </h3>
                  {!editing && (
                    <button className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center" aria-label={t('lead.action.manage_tags')}>
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      {t('lead.action.edit')}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="hidden lg:block card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                  {t('lead.labels.recent_activity')}
                </h3>
                <button onClick={() => setActiveTab('audit')} className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                  {t('lead.action.view_all')}
                </button>
              </div>

              <div className="space-y-4">
                {auditEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">{event.userName.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.userName}</p>
                      <p className="text-xs text-gray-500">{event.eventType === 'update' && event.changes && event.changes[0] ? t('audit.updated_field', { field: event.changes[0].field }) : t('audit.generic_action', { action: event.eventType })}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
};

export default LeadDetail;
