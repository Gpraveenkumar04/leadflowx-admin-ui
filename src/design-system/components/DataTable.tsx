import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { Button, Input, Badge } from './index';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchable = true,
  filterable = true,
  selectable = false,
  onSelectionChange,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1].end || 0) : 0;

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  const getSortIcon = (column: any) => {
    if (!column.getCanSort()) return null;
    if (column.getIsSorted() === 'asc') {
      return <ChevronUpIcon className="h-4 w-4" />;
    }
    if (column.getIsSorted() === 'desc') {
      return <ChevronDownIcon className="h-4 w-4" />;
    }
    return <ChevronUpDownIcon className="h-4 w-4" />;
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {searchable && (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
          {filterable && (
            <Button variant="outline" size="sm" className="ml-auto">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div ref={parentRef} className="max-h-[600px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {selectable && (
                    <th className="w-12 p-4">
                      <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        className="rounded border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                      />
                    </th>
                  )}
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx(
                        'p-4 text-left text-sm font-medium text-[var(--color-text-muted)]',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:text-[var(--color-text)]'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {getSortIcon(header.column)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className={clsx(
                      'border-b border-[var(--color-border)] transition-colors',
                      'hover:bg-[var(--color-bg-subtle)]',
                      row.getIsSelected() && 'bg-[var(--color-primary-50)]'
                    )}
                  >
                    {selectable && (
                      <td className="w-12 p-4">
                        <input
                          type="checkbox"
                          checked={row.getIsSelected()}
                          onChange={row.getToggleSelectedHandler()}
                          className="rounded border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 text-sm text-[var(--color-text)]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
          <span>
            Showing {table.getFilteredRowModel().rows.length} of {data.length} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Utility function to create sortable columns
export function createSortableColumn<T>(
  accessorKey: keyof T,
  header: string,
  cell?: (value: any, row: T) => React.ReactNode
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: cell ? ({ getValue, row }) => cell(getValue(), row.original) : undefined,
  };
}

// Utility function to create status columns
export function createStatusColumn<T>(
  accessorKey: keyof T,
  header: string,
  statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' }>
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const status = statusMap[value] || { label: value, variant: 'secondary' as const };
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  };
}
