import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  PaginationState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table'
import { Virtuoso } from 'react-virtuoso'
import { ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  error?: Error | null
  onRowClick?: (row: TData) => void
  pageCount?: number
  initialSorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  serverSide?: boolean
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  virtualScroll?: boolean
  rowHeight?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  error = null,
  onRowClick,
  pageCount,
  initialSorting,
  onSortingChange,
  serverSide = false,
  pagination,
  onPaginationChange,
  virtualScroll = false,
  rowHeight = 52,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      ...(pagination && { pagination }),
    },
    manualSorting: serverSide,
    manualPagination: serverSide,
    pageCount: pageCount,
  })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/50">
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      </div>
    )
  }

  const TableBody = virtualScroll ? VirtualTableBody : RegularTableBody

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          'flex items-center gap-2',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortingIcon sortDirection={header.column.getIsSorted()} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <TableBody
            table={table}
            loading={loading}
            rowHeight={rowHeight}
            onRowClick={onRowClick}
          />
        </table>
      </div>
      {!virtualScroll && pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getPrePaginationRowModel().rows.length
                  )}
                </span>{' '}
                of <span className="font-medium">{table.getPrePaginationRowModel().rows.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="btn btn-secondary btn-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="btn btn-secondary btn-sm"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RegularTableBody<TData>({
  table,
  loading,
  onRowClick,
}: {
  table: any
  loading: boolean
  onRowClick?: (row: TData) => void
}) {
  if (loading) {
    return <TableSkeleton columns={table.getAllColumns().length} />
  }

  if (table.getRowModel().rows.length === 0) {
    return <TableEmpty />
  }

  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      {table.getRowModel().rows.map((row: any) => (
        <tr
          key={row.id}
          onClick={() => onRowClick?.(row.original)}
          className={clsx(
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            onRowClick && 'cursor-pointer'
          )}
        >
          {row.getVisibleCells().map((cell: any) => (
            <td key={cell.id} className="px-4 py-3">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function VirtualTableBody<TData>({
  table,
  loading,
  rowHeight,
  onRowClick,
}: {
  table: any
  loading: boolean
  rowHeight: number
  onRowClick?: (row: TData) => void
}) {
  if (loading) {
    return <TableSkeleton columns={table.getAllColumns().length} />
  }

  if (table.getRowModel().rows.length === 0) {
    return <TableEmpty />
  }

  return (
    <tbody>
      <tr>
        <td colSpan={table.getAllColumns().length} className="p-0">
          <Virtuoso
            data={table.getRowModel().rows}
            itemSize={rowHeight}
            className="[&>div]:divide-y [&>div]:divide-gray-200 dark:[&>div]:divide-gray-800"
            components={{
              Item: ({ children, ...props }) => (
                <div {...props} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {children}
                </div>
              ),
            }}
            itemContent={(index, row: any) => (
              <div
                onClick={() => onRowClick?.(row.original)}
                className={clsx(
                  'flex w-full',
                  onRowClick && 'cursor-pointer'
                )}
                style={{ height: rowHeight }}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <div
                    key={cell.id}
                    className="flex items-center px-4"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )}
          />
        </td>
      </tr>
    </tbody>
  )
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function TableEmpty() {
  return (
    <tbody>
      <tr>
        <td colSpan={100} className="px-4 py-8 text-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <InboxIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No results</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No records found matching your criteria
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  )
}

function SortingIcon({ sortDirection }: { sortDirection: false | 'asc' | 'desc' }) {
  if (!sortDirection) {
    return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
  }

  if (sortDirection === 'asc') {
    return <ChevronUpIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
  }

  return <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
