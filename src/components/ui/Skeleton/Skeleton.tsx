import React from 'react'
import { clsx } from 'clsx'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  lines?: number
  variant?: 'title' | 'text' | 'button' | 'avatar' | 'card'
  animate?: boolean
}

export function Skeleton({
  className,
  lines = 1,
  variant = 'text',
  animate = true,
  ...props
}: SkeletonProps) {
  const content = React.useMemo(() => {
    if (variant === 'card') {
      return (
        <div className="space-y-3">
          <div className="h-32 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      )
    }

    if (variant === 'avatar') {
      return (
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
      )
    }

    if (variant === 'button') {
      return (
        <div className="h-9 w-24 rounded bg-gray-200 dark:bg-gray-800" />
      )
    }

    if (variant === 'title') {
      return (
        <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      )
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-4 rounded bg-gray-200 dark:bg-gray-800',
              i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
            )}
          />
        ))}
      </div>
    )
  }, [variant, lines])

  return (
    <div
      className={clsx(
        animate && 'animate-pulse',
        'cursor-wait',
        className
      )}
      {...props}
      role="status"
      aria-label="Loading..."
    >
      {content}
    </div>
  )
}

interface SkeletonTableProps {
  columns?: number
  rows?: number
  showHeader?: boolean
  className?: string
}

export function SkeletonTable({
  columns = 5,
  rows = 5,
  showHeader = true,
  className,
}: SkeletonTableProps) {
  return (
    <div className={clsx('rounded-lg border dark:border-gray-800', className)}>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            {showHeader && (
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {Array.from({ length: columns }).map((_, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-6 py-3 text-left"
                    >
                      <Skeleton className="h-4 w-24" />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: columns }).map((_, j) => (
                    <td key={j} className="whitespace-nowrap px-6 py-4">
                      <Skeleton
                        className={clsx(
                          'h-4',
                          j === 0 ? 'w-32' : 'w-24'
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface SkeletonCardProps {
  header?: boolean
  footer?: boolean
  className?: string
}

export function SkeletonCard({
  header = true,
  footer = true,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      {header && (
        <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-800 sm:px-6">
          <Skeleton className="h-5 w-48" />
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      {footer && (
        <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6">
          <div className="flex justify-end space-x-3">
            <Skeleton className="h-9 w-24" variant="button" />
            <Skeleton className="h-9 w-24" variant="button" />
          </div>
        </div>
      )}
    </div>
  )
}

export function SkeletonList({
  items = 5,
  className,
}: {
  items?: number
  className?: string
}) {
  return (
    <div
      className={clsx('divide-y divide-gray-200 dark:divide-gray-800', className)}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4">
          <Skeleton variant="avatar" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-48" variant="title" />
            <Skeleton className="mt-2" lines={2} />
          </div>
        </div>
      ))}
    </div>
  )
}
