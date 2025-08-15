import React, { useState } from 'react';
import { t } from '../i18n';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'rejected';

interface WorkflowStatusProps {
  currentStatus: WorkflowStatus;
  onStatusChange: (status: WorkflowStatus) => void;
  size?: 'sm' | 'md' | 'lg';
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  currentStatus,
  onStatusChange,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const statuses: { value: WorkflowStatus; label: string; icon: React.ReactElement; color: string }[] = [
    {
      value: 'pending',
      label: t('workflow.pending') || 'Pending',
      icon: <ClockIcon className="h-4 w-4" />,
      color: 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
    },
    {
      value: 'in_progress',
      label: t('workflow.in_progress') || 'In Progress',
      icon: <ClockIcon className="h-4 w-4" />,
      color: 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]'
    },
    {
      value: 'completed',
      label: t('workflow.completed') || 'Completed',
      icon: <CheckCircleIcon className="h-4 w-4" />,
      color: 'bg-[var(--color-success-100)] text-[var(--color-success-800)]'
    },
    {
      value: 'on_hold',
      label: t('workflow.on_hold') || 'On Hold',
      icon: <ExclamationCircleIcon className="h-4 w-4" />,
      color: 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
    },
    {
      value: 'rejected',
      label: t('workflow.rejected') || 'Rejected',
      icon: <XCircleIcon className="h-4 w-4" />,
      color: 'bg-[var(--color-danger-100)] text-[var(--color-danger-800)]'
    }
  ];

  const currentStatusObj = statuses.find(status => status.value === currentStatus) || statuses[0];
  
  const handleStatusChange = (status: WorkflowStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center rounded-md ${currentStatusObj.color} ${sizeClasses[size]} font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
      >
        <span className="mr-1">{currentStatusObj.icon}</span>
        <span>{currentStatusObj.label}</span>
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentStatus === status.value ? 'bg-gray-50' : ''
                }`}
              >
                <span className={`inline-flex items-center justify-center rounded-full p-1 mr-2 ${status.color}`}>
                  {status.icon}
                </span>
                <span>{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowStatus;
