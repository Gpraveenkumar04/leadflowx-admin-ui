import React from 'react';
import { clsx } from 'clsx';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  hover?: boolean;
  striped?: boolean;
  compact?: boolean;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  truncate?: boolean;
}

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, hover, striped, compact, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <table
          ref={ref}
          className={clsx(
            'w-full border-separate border-spacing-0',
            hover && '[&_tr:hover]:bg-[var(--color-bg-subtle)]',
            striped && '[&_tr:nth-child(even)]:bg-[color-mix(in_srgb,var(--color-bg-subtle)_60%,transparent)]',
            compact && '[&_td]:py-2 [&_th]:py-2',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx('bg-[var(--color-bg-subtle)]', className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx(
          '[&_tr:last-child_td]:border-b-0',
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          'transition-colors',
          selected && 'bg-primary-50 dark:bg-primary-900/20',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, truncate, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          'px-6 py-4 text-sm border-b border-[var(--color-border)]',
          truncate && 'max-w-[200px] truncate',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

const TableHeaderCell = React.forwardRef<HTMLTableHeaderCellElement, TableHeaderCellProps>(
  ({ className, sortable, sorted, onSort, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-subtle)] border-b border-[var(--color-border)]',
          sortable && 'cursor-pointer hover:text-[var(--color-text-muted)]',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          {sortable && (
            <span className="inline-flex flex-col h-3 w-3 justify-center items-center">
              {sorted === 'asc' ? (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
              ) : sorted === 'desc' ? (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              ) : (
                <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              )}
            </span>
          )}
        </div>
      </th>
    );
  }
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';
TableHeaderCell.displayName = 'TableHeaderCell';

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell };
