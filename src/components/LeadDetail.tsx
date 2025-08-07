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
import { Lead, Tag, QAStatus, UserRole, User } from '../types';
import Comments, { Comment } from './Comments';
import AuditTrail, { AuditEvent } from './AuditTrail';
import UserAssignment from './UserAssignment';
import WorkflowStatus from './WorkflowStatus';
import { clsx } from 'clsx';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onUpdate: (lead: Lead) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ 
  lead, 
  onBack,
  onUpdate
}) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'audit'>('details');
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [loading, setLoading] = useState({
    comments: true,
    audit: true,
    saving: false
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', role: 'admin', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', role: 'qa_rep', email: 'jane@example.com' },
    { id: '3', name: 'Alex Brown', role: 'sdr', email: 'alex@example.com' },
  ]);
  const [workflowStatus, setWorkflowStatus] = useState<Lead['workflowStatus']>(lead.workflowStatus || 'pending');

  // Memoize available users to prevent unnecessary re-renders
  const availableUsersMemo = useMemo(() => availableUsers, [availableUsers]);
  
  // Memoize score status color calculation
  const auditScoreColor = useMemo(() => {
    const score = lead.auditScore || 0;
    return score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  }, [lead.auditScore]);
  
  const leadScoreColor = useMemo(() => {
    const score = lead.leadScore || 0;
    return score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  }, [lead.leadScore]);

  useEffect(() => {
    // In a real implementation, we would fetch these from API
    fetchComments();
    fetchAuditTrail();
  }, [lead.id]);

  const fetchComments = async () => {
    setLoading(prev => ({ ...prev, comments: true }));
    try {
      // In a real implementation:
      // const response = await leadsAPI.getComments(lead.id);
      // setComments(response.data || []);

      // Mock data for demonstration
      setTimeout(() => {
        setComments([
          {
            id: '1',
            text: 'This lead looks promising. @Jane Smith can you follow up?',
            userId: '1',
            userName: 'John Doe',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            mentions: ['2']
          },
          {
            id: '2',
            text: 'Sure, I\'ll reach out tomorrow morning.',
            userId: '2',
            userName: 'Jane Smith',
            timestamp: new Date(Date.now() - 1800000).toISOString()
          }
        ]);
        setLoading(prev => ({ ...prev, comments: false }));
      }, 500);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  const fetchAuditTrail = async () => {
    setLoading(prev => ({ ...prev, audit: true }));
    try {
      // In a real implementation:
      // const response = await leadsAPI.getAuditTrail(lead.id, 'lead');
      // setAuditEvents(response.data || []);
      
      // Mock data for demonstration
      setTimeout(() => {
        setAuditEvents([
          {
            id: '1',
            eventType: 'create',
            entityId: lead.id,
            entityType: 'lead',
            userId: '3',
            userName: 'System',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            eventType: 'update',
            entityId: lead.id,
            entityType: 'lead',
            userId: '1',
            userName: 'John Doe',
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            changes: [
              {
                field: 'email',
                oldValue: 'old@example.com',
                newValue: lead.email
              }
            ]
          },
          {
            id: '3',
            eventType: 'tag',
            entityId: lead.id,
            entityType: 'lead',
            userId: '2',
            userName: 'Jane Smith',
            timestamp: new Date(Date.now() - 21600000).toISOString(),
            metadata: {
              added: 'Hot Lead'
            }
          }
        ]);
        setLoading(prev => ({ ...prev, audit: false }));
      }, 700);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      setLoading(prev => ({ ...prev, audit: false }));
    }
  };

  const handleAddComment = useCallback(async (text: string, mentions: string[]) => {
    try {
      // In a real implementation:
      // await leadsAPI.addComment(lead.id, 'lead', text, mentions);
      // await fetchComments();
      
      // Mock data for demonstration
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        text,
        userId: '1', // Current user
        userName: 'Current User',
        timestamp: new Date().toISOString(),
        mentions
      };
      
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }, [lead.id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      // In a real implementation:
      // await leadsAPI.deleteComment(commentId);
      // await fetchComments();
      
      // Mock data for demonstration
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }, []);

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
      
      // Calculate which fields have changed
      const changedFields = Object.keys(formData).filter(key => 
        formData[key as keyof Lead] !== lead[key as keyof Lead]
      );
      
      if (changedFields.length === 0) {
        cancelEditing();
        return;
      }
      
      const updatedLead = { ...lead, ...formData };
      await onUpdate(updatedLead);
      
      setEditing(false);
      setFormData({});
      
      // Refresh audit trail after update
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
    
    // Record this change in the audit trail
    const newAuditEvent: AuditEvent = {
      id: `temp-${Date.now()}`,
      eventType: 'update',
      entityId: lead.id,
      entityType: 'lead',
      userId: '1', // Current user
      userName: 'Current User',
      timestamp: new Date().toISOString(),
      changes: [
        {
          field: 'workflowStatus',
          oldValue: lead.workflowStatus || 'pending',
          newValue: status
        }
      ]
    };
    
    setAuditEvents(prev => [newAuditEvent, ...prev]);
  }, [lead.id, lead.workflowStatus]);

  const handleAssignUser = useCallback((userId: string) => {
    const selectedUser = availableUsers.find(user => user.id === userId);
    const userName = selectedUser ? selectedUser.name : 'Unassigned';
    
    setFormData(prev => ({ ...prev, assigneeId: userId || undefined }));
    
    // Record this change in the audit trail
    const newAuditEvent: AuditEvent = {
      id: `temp-${Date.now()}`,
      eventType: 'update',
      entityId: lead.id,
      entityType: 'lead',
      userId: '1', // Current user
      userName: 'Current User',
      timestamp: new Date().toISOString(),
      changes: [
        {
          field: 'assignee',
          oldValue: lead.assigneeId ? availableUsers.find(u => u.id === lead.assigneeId)?.name || 'Unknown' : 'Unassigned',
          newValue: userName
        }
      ]
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
      {/* Modern floating header with sticky positioning */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm rounded-lg px-4 py-3 mb-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="btn btn-ghost hover:bg-gray-100 p-2 rounded-full mr-3"
              aria-label="Go back to leads list"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to Leads</span>
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {editing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    className="input focus:ring-primary-500 font-bold text-xl"
                    placeholder="Company Name"
                    aria-label="Company Name"
                    required
                  />
                ) : (
                  <span className="truncate max-w-[200px] sm:max-w-[400px]">
                    {lead.company}
                  </span>
                )}
                
                <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-md" title="Lead ID">
                  ID: {lead.correlationId?.slice(0, 8)}
                </span>
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="flex items-center mr-3">
                  <MapPinIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                  {lead.source || 'Unknown source'}
                </span>
                
                {lead.scrapedAt && (
                  <span className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                    <time dateTime={lead.scrapedAt}>
                      {new Date(lead.scrapedAt).toLocaleDateString()}
                    </time>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            {lead.tags && lead.tags.length > 0 && !editing && (
              <div className="hidden md:flex items-center flex-wrap gap-1 mr-2" aria-label="Lead tags">
                {lead.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    title={`Tag: ${tag.name}`}
                  >
                    <TagIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            
            {editing ? (
              <div className="flex gap-2">
                <button 
                  onClick={cancelEditing} 
                  className="btn btn-outline btn-sm"
                  aria-label="Cancel editing"
                  disabled={loading.saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={saveChanges} 
                  className={clsx(
                    "btn btn-primary btn-sm flex items-center gap-1",
                    loading.saving && "opacity-75 cursor-not-allowed"
                  )}
                  aria-label="Save changes to lead"
                  disabled={loading.saving}
                >
                  {loading.saving ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <WorkflowStatus
                  currentStatus={workflowStatus || 'pending'}
                  onStatusChange={handleWorkflowStatusChange}
                  size="sm"
                  aria-labelledby="workflow-status-label"
                />
                
                <button
                  onClick={startEditing}
                  className="btn btn-primary btn-sm flex items-center gap-1"
                  aria-label="Edit lead details"
                >
                  <PencilIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                    className="btn btn-ghost btn-sm p-2 rounded-full"
                    aria-label="More actions"
                    aria-expanded={actionsMenuOpen}
                    aria-haspopup="true"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {actionsMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => { 
                            /* Handle duplicate */
                            setActionsMenuOpen(false);
                          }}
                        >
                          <DocumentDuplicateIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
                          Duplicate Lead
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => { 
                            /* Handle export */
                            setActionsMenuOpen(false);
                          }}
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
                          Reaudit Lead
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            /* Handle detailed metrics */
                            setActionsMenuOpen(false);
                          }}
                        >
                          <ChartBarIcon className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
                          View Metrics
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            /* Handle delete */
                            setActionsMenuOpen(false);
                          }}
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          Delete Lead
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sub-navigation tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Lead sections">
            <button
              onClick={() => setActiveTab('details')}
              className={clsx(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === 'details'
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === 'details' ? 'page' : undefined}
            >
              Details
            </button>
            
            <button
              onClick={() => setActiveTab('comments')}
              className={clsx(
                "py-2 px-1 border-b-2 font-medium text-sm flex items-center",
                activeTab === 'comments'
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === 'comments' ? 'page' : undefined}
            >
              Comments
              {comments.length > 0 && (
                <span className={clsx(
                  "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                  activeTab === 'comments'
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-600"
                )}>
                  {comments.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('audit')}
              className={clsx(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === 'audit'
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === 'audit' ? 'page' : undefined}
            >
              Audit Trail
            </button>
          </nav>
        </div>
      </div>

      {/* Modern responsive card layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area - changes based on active tab */}
        <div className={clsx(
          "lg:col-span-2 space-y-6",
          activeTab !== 'details' && "order-2",
        )}>
          {/* Details tab */}
          {activeTab === 'details' && (
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200">
              <div className="card-body p-6">
                <h2 className="sr-only">Lead details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Contact name */}
                    <div>
                      <label 
                        htmlFor="contact-name" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Name
                      </label>
                      {editing ? (
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          className="input mt-1 w-full focus:ring-primary-500 focus:border-primary-500"
                          aria-label="Contact name"
                        />
                      ) : (
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                          <span id="contact-name" className="font-medium">{lead.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      {editing ? (
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          className="input mt-1 w-full focus:ring-primary-500 focus:border-primary-500"
                          aria-label="Contact email address"
                          autoComplete="email"
                        />
                      ) : (
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" />
                          <a 
                            href={`mailto:${lead.email}`} 
                            className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors"
                            aria-label={`Send email to ${lead.email}`}
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label 
                        htmlFor="phone" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      {editing ? (
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          className="input mt-1 w-full focus:ring-primary-500 focus:border-primary-500"
                          aria-label="Contact phone number"
                          autoComplete="tel"
                          pattern="[0-9+\- ]+"
                        />
                      ) : (
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group">
                          <PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" />
                          <a 
                            href={`tel:${lead.phone}`} 
                            className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors"
                            aria-label={`Call ${lead.phone}`}
                          >
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Website */}
                    <div>
                      <label 
                        htmlFor="website" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Website
                      </label>
                      {editing ? (
                        <input
                          id="website"
                          type="url"
                          name="website"
                          value={formData.website || ''}
                          onChange={handleInputChange}
                          className="input mt-1 w-full focus:ring-primary-500 focus:border-primary-500"
                          aria-label="Company website URL"
                          placeholder="https://example.com"
                          autoComplete="url"
                        />
                      ) : (
                        <div className="flex items-center mt-1 p-2 bg-gray-50 rounded-md group">
                          <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 mr-2" aria-hidden="true" />
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors flex items-center"
                            aria-label={`Visit company website: ${lead.website}`}
                          >
                            <span className="truncate max-w-[200px]">{lead.website}</span>
                            <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1 flex-shrink-0" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Assigned To */}
                    <div>
                      <h3 className="block text-sm font-medium text-gray-700 mb-1" id="assigned-to-label">
                        Assigned To
                      </h3>
                      <UserAssignment 
                        currentAssigneeId={formData.assigneeId || lead.assigneeId}
                        onAssign={handleAssignUser}
                        label="Assign"
                        size="md"
                        showLabel={false}
                        aria-labelledby="assigned-to-label"
                      />
                    </div>
                    
                    {/* Mobile-only Workflow Status */}
                    <div className="lg:hidden">
                      <h3 className="block text-sm font-medium text-gray-700 mb-1" id="workflow-status-mobile-label">
                        Workflow Status
                      </h3>
                      <WorkflowStatus
                        currentStatus={workflowStatus || 'pending'}
                        onStatusChange={handleWorkflowStatusChange}
                        size="md"
                        aria-labelledby="workflow-status-mobile-label"
                      />
                    </div>
                    
                    {/* Mobile-only Tags section */}
                    {lead.tags && lead.tags.length > 0 && !editing && (
                      <div className="md:hidden mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map(tag => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: tag.color + '20', color: tag.color }}
                            >
                              <TagIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Comments tab */}
          {activeTab === 'comments' && (
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200">
              <div className="card-body p-6">
                <Comments
                  entityId={lead.id}
                  entityType="lead"
                  comments={comments}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  availableUsers={availableUsersMemo}
                  loading={loading.comments}
                />
              </div>
            </div>
          )}
          
          {/* Audit tab */}
          {activeTab === 'audit' && (
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200">
              <div className="card-body p-6">
                <AuditTrail 
                  events={auditEvents}
                  title="Complete Activity History"
                  maxHeight="600px"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar - Always visible */}
        <aside className={clsx(
          "space-y-6",
          activeTab !== 'details' && "order-1",
        )}>
          {/* QA Status Card */}
          <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-900 flex items-center" id="qa-status-label">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                  QA Status
                </h3>
                
                {lead.qaReviewedAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(lead.qaReviewedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="space-y-2" role="radiogroup" aria-labelledby="qa-status-label">
                <button
                  className={clsx(
                    "flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    editing && "hover:bg-gray-100",
                    formData.qaStatus === 'approved' || lead.qaStatus === 'approved' 
                      ? "bg-green-50 border border-green-200 shadow-sm" 
                      : "border border-transparent"
                  )}
                  onClick={() => handleQAStatusChange('approved')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'approved' || lead.qaStatus === 'approved'}
                  aria-label="Approve this lead"
                  tabIndex={formData.qaStatus === 'approved' || lead.qaStatus === 'approved' ? 0 : -1}
                >
                  <CheckCircleIcon className={clsx(
                    "h-5 w-5 mr-2",
                    formData.qaStatus === 'approved' || lead.qaStatus === 'approved' ? "text-green-500" : "text-gray-300"
                  )} 
                  aria-hidden="true" />
                  <span className="font-medium">Approved</span>
                </button>
                
                <button
                  className={clsx(
                    "flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    editing && "hover:bg-gray-100",
                    formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected' 
                      ? "bg-red-50 border border-red-200 shadow-sm" 
                      : "border border-transparent"
                  )}
                  onClick={() => handleQAStatusChange('rejected')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected'}
                  aria-label="Reject this lead"
                  tabIndex={formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected' ? 0 : -1}
                >
                  <XMarkIcon className={clsx(
                    "h-5 w-5 mr-2",
                    formData.qaStatus === 'rejected' || lead.qaStatus === 'rejected' ? "text-red-500" : "text-gray-300"
                  )} 
                  aria-hidden="true" />
                  <span className="font-medium">Rejected</span>
                </button>
                
                <button
                  className={clsx(
                    "flex items-center w-full p-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    editing && "hover:bg-gray-100",
                    formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review' 
                      ? "bg-yellow-50 border border-yellow-200 shadow-sm" 
                      : "border border-transparent"
                  )}
                  onClick={() => handleQAStatusChange('needs_review')}
                  disabled={!editing}
                  role="radio"
                  aria-checked={formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review'}
                  aria-label="Mark lead for review"
                  tabIndex={formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review' ? 0 : -1}
                >
                  <ExclamationCircleIcon className={clsx(
                    "h-5 w-5 mr-2",
                    formData.qaStatus === 'needs_review' || lead.qaStatus === 'needs_review' ? "text-yellow-500" : "text-gray-300"
                  )} 
                  aria-hidden="true" />
                  <span className="font-medium">Needs Review</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="card-body p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1" id="audit-score-label">
                  Audit Score
                </h3>
                <div className="flex items-end">
                  <div 
                    className={clsx(
                      "text-3xl font-bold",
                      auditScoreColor
                    )}
                    aria-labelledby="audit-score-label"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={lead.auditScore || 0}
                    role="meter"
                  >
                    {lead.auditScore || 0}
                  </div>
                  <span className="text-xs text-gray-500 ml-1 mb-1">/100</span>
                </div>
                
                {/* Progress bar visualization */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={clsx(
                      "h-2 rounded-full",
                      (lead.auditScore || 0) >= 80 ? "bg-green-500" : 
                      (lead.auditScore || 0) >= 60 ? "bg-yellow-500" : 
                      "bg-red-500"
                    )}
                    style={{ width: `${lead.auditScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="card-body p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1" id="lead-score-label">
                  Lead Score
                </h3>
                <div className="flex items-end">
                  <div 
                    className={clsx(
                      "text-3xl font-bold",
                      leadScoreColor
                    )}
                    aria-labelledby="lead-score-label"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={lead.leadScore || 0}
                    role="meter"
                  >
                    {lead.leadScore || 0}
                  </div>
                  <span className="text-xs text-gray-500 ml-1 mb-1">/100</span>
                </div>
                
                {/* Progress bar visualization */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={clsx(
                      "h-2 rounded-full",
                      (lead.leadScore || 0) >= 80 ? "bg-green-500" : 
                      (lead.leadScore || 0) >= 60 ? "bg-yellow-500" : 
                      "bg-red-500"
                    )}
                    style={{ width: `${lead.leadScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags card */}
          {lead.tags && lead.tags.length > 0 && !editing && (
            <div className="hidden md:block card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="card-body p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-900 flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                    Tags
                  </h3>
                  
                  {!editing && (
                    <button
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center"
                      aria-label="Manage tags"
                    >
                      <PencilIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Recent activity summary */}
          <div className="hidden lg:block card bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-gray-900 flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
                  Recent Activity
                </h3>
                
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                >
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {auditEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {event.userName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.eventType === 'update' && event.changes && event.changes[0]
                          ? `Updated ${event.changes[0].field}`
                          : `${event.eventType} action`}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </div>
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
