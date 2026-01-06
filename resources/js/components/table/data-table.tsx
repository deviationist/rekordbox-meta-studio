import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { renderHeader } from './table-header';
import { useTableState } from './use-table-state';
import { TableToolbar } from './table-toolbar';

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  meta: PaginationMeta;
  endpoint: string;
  filters?: Record<string, any>;
  storageKey?: string;
}

export function DataTable<TData>({
  columns,
  data,
  meta,
  endpoint,
  filters = {},
  storageKey = 'datatable-state',
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    pinnedColumns,
    setPinnedColumns,
    resetState,
  } = useTableState({ storageKey });

  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<TData[]>(data);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta>(meta);
  const [hasMore, setHasMore] = useState(meta.current_page < meta.last_page);

  const table = useReactTable({
    data: allData,
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
  });

  const { rows } = table.getRowModel();

  // Virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Calculate grid template columns
  const gridTemplateColumns = table.getVisibleLeafColumns()
    .map(col => `${col.getSize()}px`)
    .join(' ');

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    return;
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentMeta.current_page + 1;

    router.get(
      endpoint,
      { ...filters, page: nextPage, per_page: currentMeta.per_page },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['data', 'meta'],
        onSuccess: (page: any) => {
          const newData = page.props.data || [];
          const newMeta = page.props.meta || currentMeta;

          setAllData(prev => [...prev, ...newData]);
          setCurrentMeta(newMeta);
          setHasMore(newMeta.current_page < newMeta.last_page);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      }
    );
  }, [currentMeta, endpoint, filters, hasMore, isLoading]);

  // Detect scroll near bottom
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Column pinning helpers
  const togglePin = (columnId: string, side: 'left' | 'right') => {
    setPinnedColumns(prev => {
      const newPinned = { ...prev };
      const otherSide = side === 'left' ? 'right' : 'left';

      // Remove from other side
      newPinned[otherSide] = newPinned[otherSide].filter(id => id !== columnId);

      // Toggle on current side
      if (newPinned[side].includes(columnId)) {
        newPinned[side] = newPinned[side].filter(id => id !== columnId);
      } else {
        newPinned[side] = [...newPinned[side], columnId];
      }

      return newPinned;
    });
  };

  const isPinned = (columnId: string): 'left' | 'right' | false => {
    if (pinnedColumns.left.includes(columnId)) return 'left';
    if (pinnedColumns.right.includes(columnId)) return 'right';
    return false;
  };

  return (
    <div className="space-y-4">

      <TableToolbar
        allData={allData}
        currentMeta={currentMeta}
        table={table}
        resetState={resetState}
      />

      <div
        ref={tableContainerRef}
        className="relative overflow-auto border rounded-lg"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className="min-w-full">
          <div
            className="sticky top-0 z-20 bg-background border-b grid"
            style={{ gridTemplateColumns }}
          >
            {table.getHeaderGroups().map(headerGroup => (
              headerGroup.headers.map(header => {
                const isPinnedLeft = pinnedColumns.left.includes(header.column.id);
                const isPinnedRight = pinnedColumns.right.includes(header.column.id);

                return (
                  <div
                    key={header.id}
                    className={cn(
                      "border-r last:border-r-0",
                      isPinnedLeft && "sticky left-0 z-30 bg-background border-r-2 border-border",
                      isPinnedRight && "sticky right-0 z-30 bg-background border-l-2 border-border",
                      !isPinnedLeft && !isPinnedRight && "bg-muted/50"
                    )}
                  >
                    {renderHeader(header, togglePin, isPinned)}
                  </div>
                );
              })
            ))}
          </div>

          <div>
            {virtualRows.length > 0 ? (
              <>
                {/* Top padding */}
                {virtualRows[0]?.start > 0 && (
                  <div style={{ height: virtualRows[0].start }} />
                )}

                {/* Visible rows */}
                {virtualRows.map(virtualRow => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      className="grid border-b hover:bg-muted/50 transition-colors"
                      style={{ gridTemplateColumns }}
                    >
                      {row.getVisibleCells().map(cell => {
                        const isPinnedLeft = pinnedColumns.left.includes(cell.column.id);
                        const isPinnedRight = pinnedColumns.right.includes(cell.column.id);
                        const meta = cell.column.columnDef.meta

                        return (
                          <div
                            key={cell.id}
                            className={cn(
                              meta?.padding !== false ? "px-1.5 py-1" : "",
                              "inline-flex items-center text-sm truncate border-r last:border-r-0",
                              isPinnedLeft && "sticky left-0 bg-background",
                              isPinnedRight && "sticky right-0 bg-background"
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Bottom padding */}
                {virtualRows[virtualRows.length - 1] && (
                  <div
                    style={{
                      height: totalSize - virtualRows[virtualRows.length - 1].end,
                    }}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No results found
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="text-center py-4 text-muted-foreground">
                Loading more...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

