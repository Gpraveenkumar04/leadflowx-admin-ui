import React from 'react';
import { 
  ClockIcon,
  UserCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  PencilSquareIcon,
  EyeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

export interface AuditEvent {
  id: string;
  eventType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'tag' | 'view' | 'export';
  entityId: number | string;
  entityType: 'lead' | 'job' | 'task';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

interface AuditTrailProps {
  events: AuditEvent[];
  title?: string;
  maxHeight?: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ 
  events, 
  title = "Audit Trail",
  maxHeight = "300px" 
}) => {
  // Format timestamp to relative time and full date tooltip
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let relativeTime = '';
    if (diffInSeconds < 60) relativeTime = 'just now';
    else if (diffInSeconds < 3600) relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
    else if (diffInSeconds < 86400) relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
    else if (diffInSeconds < 604800) relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;
    else relativeTime = date.toLocaleDateString();
    
    // Full date and time for tooltip
    const fullDateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
    
    return { relativeTime, fullDateTime };
  };

  // Get icon for event type
  const getEventIcon = (eventType: AuditEvent['eventType']) => {
    switch (eventType) {
      case 'create':
        return <DocumentDuplicateIcon className="h-5 w-5 text-green-600" />;
      case 'update':
        return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
      case 'delete':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'approve':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'reject':
        return <XCircleIcon className="h-5 w-5 text-orange-600" />;
      case 'tag':
        return <TagIcon className="h-5 w-5 text-purple-600" />;
      case 'view':
        return <EyeIcon className="h-5 w-5 text-gray-600" />;
      case 'export':
        return <ArrowPathIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get descriptive text for event
  const getEventDescription = (event: AuditEvent) => {
    switch (event.eventType) {
      case 'create':
        return `created this ${event.entityType}`;
      case 'update':
        if (event.changes && event.changes.length) {
          if (event.changes.length === 1) {
            return `updated the ${event.changes[0].field} field`;
          }
          return `updated ${event.changes.length} fields`;
        }
        return `updated this ${event.entityType}`;
      case 'delete':
        return `deleted this ${event.entityType}`;
      case 'approve':
        return `approved this ${event.entityType}`;
      case 'reject':
        return `rejected this ${event.entityType}${event.metadata?.reason ? ` (${event.metadata.reason})` : ''}`;
      case 'tag':
        if (event.metadata?.added) {
          return `added tag "${event.metadata.added}"`;
        }
        if (event.metadata?.removed) {
          return `removed tag "${event.metadata.removed}"`;
        }
        return `modified tags`;
      case 'view':
        return `viewed this ${event.entityType}`;
      case 'export':
        return `exported this ${event.entityType}`;
      default:
        return `performed action on this ${event.entityType}`;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      <div className="overflow-hidden">
        <div 
          className="flow-root overflow-y-auto" 
          style={{ maxHeight }}
        >
          <ul role="list" className="-mb-8">
            {events.length > 0 ? (
              events.map((event, eventIdx) => {
                const { relativeTime, fullDateTime } = formatTimestamp(event.timestamp);
                return (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== events.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                            {event.userAvatar ? (
                              <img 
                                src={event.userAvatar} 
                                alt={event.userName} 
                                className="h-8 w-8 rounded-full" 
                              />
                            ) : (
                              <UserCircleIcon className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <span className="absolute -bottom-0.5 -right-1 rounded-tl rounded-br bg-white p-0.5">
                            {getEventIcon(event.eventType)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.userName}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {getEventDescription(event)}
                            </p>
                            {event.changes && event.changes.length > 0 && (
                              <div className="mt-2 text-xs">
                                {event.changes.map((change, idx) => (
                                  <div key={idx} className="grid grid-cols-4 gap-1 text-gray-600 mb-1">
                                    <div className="font-medium">{change.field}</div>
                                    <div className="line-through text-gray-500">{
                                      typeof change.oldValue === 'string' ? 
                                        change.oldValue : 
                                        JSON.stringify(change.oldValue)
                                    }</div>
                                    <div className="text-gray-900">{
                                      typeof change.newValue === 'string' ? 
                                        change.newValue : 
                                        JSON.stringify(change.newValue)
                                    }</div>
                                    <div className="text-right">
                                      <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800">
                                        changed
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-right text-xs text-gray-500">
                            <time 
                              dateTime={event.timestamp} 
                              title={fullDateTime}
                            >
                              {relativeTime}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li>
                <div className="text-center py-4 text-sm text-gray-500">
                  No audit events found.
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
