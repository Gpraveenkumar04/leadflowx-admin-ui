import React from 'react'
import { clsx } from 'clsx'
import {
  DocumentSearchIcon,
  ExclamationTriangleIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: 'search' | 'inbox' | 'warning' | React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = 'inbox',
  action,
  className,
}: EmptyStateProps) {
  const IconComponent = typeof Icon === 'string' ? 
    Icon === 'search' ? DocumentSearchIcon :
    Icon === 'warning' ? ExclamationTriangleIcon :
    InboxIcon
    : Icon

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-12 text-center dark:border-gray-800',
        className
      )}
    >
      <IconComponent className="h-12 w-12 text-gray-400 dark:text-gray-600" />
      <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

interface EmptyTableStateProps extends EmptyStateProps {
  colSpan: number
}

export function EmptyTableState({ colSpan, ...props }: EmptyTableStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-8">
        <EmptyState {...props} />
      </td>
    </tr>
  )
}
