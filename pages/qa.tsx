import React, { useState, useEffect } from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import { qaAPI } from '../src/services/api';
import { Lead, QAStatus } from '../src/types';
import { clsx } from 'clsx';

interface QANoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveNotes: (leadId: number, notes: string) => void;
}

const QANoteModal: React.FC<QANoteModalProps> = ({ isOpen, onClose, lead, onSaveNotes }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (lead) {
      setNotes(lead.qaNotes || '');
    }
  }, [lead]);

  const handleSave = () => {
    if (lead) {
      onSaveNotes(lead.id, notes);
      onClose();
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              QA Notes - {lead.company}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {lead.name}</div>
              <div><strong>Email:</strong> {lead.email}</div>
              <div><strong>Phone:</strong> {lead.phone}</div>
              <div><strong>Website:</strong> {lead.website}</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">QA Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="input"
              placeholder="Add your QA review notes here..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Lead Details - {lead.company}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Company:</span>
                  <span>{lead.company}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Name:</span>
                  <span>{lead.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Email:</span>
                  <span>{lead.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Phone:</span>
                  <span>{lead.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Website:</span>
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" 
                     className="text-primary-600 hover:text-primary-800 truncate">
                    {lead.website}
                  </a>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">Source:</span>
                  <span className="badge badge-primary">{lead.source || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Audit Breakdown */}
            {lead.auditBreakdown && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Audit Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${lead.auditBreakdown.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {lead.auditBreakdown.performance}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">SEO</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${lead.auditBreakdown.seo}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {lead.auditBreakdown.seo}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">SSL</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${lead.auditBreakdown.ssl}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {lead.auditBreakdown.ssl}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Mobile</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${lead.auditBreakdown.mobile}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {lead.auditBreakdown.mobile}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          {lead.timeline && lead.timeline.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Timeline</h4>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {lead.timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== lead.timeline!.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                              <CheckIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.action}
                                {event.user && (
                                  <span className="font-medium text-gray-900"> by {event.user}</span>
                                )}
                              </p>
                              {event.details && (
                                <p className="text-xs text-gray-400 mt-1">{event.details}</p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{new Date(event.timestamp).toLocaleString()}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function QAQueue() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sampleSize, setSampleSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showNoteModal, setShowNoteModal] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<Lead | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchQAQueue();
  }, [pagination.page, sampleSize]);

  const fetchQAQueue = async () => {
    try {
      setLoading(true);
      const response = await qaAPI.getQAQueue(pagination.page, pagination.pageSize, sampleSize);
      setLeads(response.data || []);
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch QA queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLead = async (leadId: number, notes?: string) => {
    try {
      await qaAPI.approveLead(leadId, notes);
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    } catch (error) {
      console.error('Failed to approve lead:', error);
    }
  };

  const handleRejectLead = async (leadId: number, notes: string) => {
    try {
      await qaAPI.rejectLead(leadId, notes);
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    } catch (error) {
      console.error('Failed to reject lead:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (!confirm(`Are you sure you want to approve ${selectedLeads.length} leads?`)) return;
    
    try {
      await Promise.all(selectedLeads.map(id => qaAPI.approveLead(id)));
      setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  const handleBulkReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await Promise.all(selectedLeads.map(id => qaAPI.rejectLead(id, reason)));
      setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to bulk reject:', error);
    }
  };

  const handleSaveNotes = async (leadId: number, notes: string) => {
    try {
      await qaAPI.addNotes(leadId, notes);
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, qaNotes: notes } : lead
      ));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedLeads(selected ? filteredLeads.map(lead => lead.id) : []);
  };

  const filteredLeads = leads.filter(lead => 
    searchTerm === '' || 
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreBadge = (score?: number) => {
    if (!score) return <span className="badge badge-secondary">-</span>;
    
    const color = score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger';
    return <span className={`badge ${color}`}>{score}</span>;
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
              QA Queue
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and approve leads from the pipeline
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            {selectedLeads.length > 0 && (
              <>
                <button onClick={handleBulkApprove} className="btn btn-success btn-sm">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Approve ({selectedLeads.length})
                </button>
                <button onClick={handleBulkReject} className="btn btn-danger btn-sm">
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Reject Selected
                </button>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sample Size</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-12">{sampleSize}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchQAQueue}
                  className="btn btn-primary w-full"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                  Refresh Queue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QA Queue Table */}
        <div className="card">
          <div className="overflow-hidden">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell w-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  </th>
                  <th className="table-header-cell">Company</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Phone</th>
                  <th className="table-header-cell">Audit Score</th>
                  <th className="table-header-cell">Lead Score</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.website}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{lead.name}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{lead.phone}</div>
                    </td>
                    <td className="table-cell">
                      {getScoreBadge(lead.auditScore)}
                    </td>
                    <td className="table-cell">
                      {getScoreBadge(lead.leadScore)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveLead(lead.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) handleRejectLead(lead.id, reason);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowNoteModal(lead)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Add notes"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDetailModal(lead)}
                          className="text-gray-600 hover:text-gray-800"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <CheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leads in queue</h3>
            <p className="mt-1 text-sm text-gray-500">
              All leads have been reviewed or no leads match your current sample size.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredLeads.length > 0 && (
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
        )}

        {/* Modals */}
        <QANoteModal
          isOpen={showNoteModal !== null}
          onClose={() => setShowNoteModal(null)}
          lead={showNoteModal}
          onSaveNotes={handleSaveNotes}
        />

        <LeadDetailModal
          isOpen={showDetailModal !== null}
          onClose={() => setShowDetailModal(null)}
          lead={showDetailModal}
        />
      </div>
    </Layout>
  );
}
