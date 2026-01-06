import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnOrderState,
  VisibilityState,
  ColumnSizingState,
  flexRender,
  Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ChevronsUpDown, EyeOff, GripVertical, Pin, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationMeta {
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

interface ColumnState {
  order: string[];
  visibility: VisibilityState;
  sizing: ColumnSizingState;
  pinned: { left: string[]; right: string[] };
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
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [pinnedColumns, setPinnedColumns] = useState<{ left: string[]; right: string[] }>({
    left: [],
    right: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<TData[]>(data);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta>(meta);
  const [hasMore, setHasMore] = useState(meta.current_page < meta.last_page);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const state: ColumnState = JSON.parse(saved);
        setColumnOrder(state.order || []);
        setColumnVisibility(state.visibility || {});
        setColumnSizing(state.sizing || {});
        setPinnedColumns(state.pinned || { left: [], right: [] });
      } catch (e) {
        console.error('Failed to parse saved table state:', e);
      }
    }
  }, [storageKey]);

  // Save state to localStorage
  const saveState = useCallback(() => {
    const state: ColumnState = {
      order: columnOrder,
      visibility: columnVisibility,
      sizing: columnSizing,
      pinned: pinnedColumns,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [columnOrder, columnVisibility, columnSizing, pinnedColumns, storageKey]);

  useEffect(() => {
    saveState();
  }, [saveState]);

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

  // Infinite scroll handler
  const loadMore = useCallback(() => {
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

  const resetState = () => {
    setColumnOrder([]);
    setColumnVisibility({});
    setColumnSizing({});
    setPinnedColumns({ left: [], right: [] });
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {allData?.length ? allData.length.toLocaleString() : 0} of {currentMeta.total.toLocaleString()} records
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={resetState}>
              Reset Layout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {table.getAllLeafColumns().map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(value)}
              >
                {column.columnDef.header as string}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className="relative overflow-auto border rounded-lg"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-background border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const isPinnedLeft = pinnedColumns.left.includes(header.column.id);
                  const isPinnedRight = pinnedColumns.right.includes(header.column.id);

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        isPinnedLeft && "sticky left-0 z-30 bg-background border-r-2 border-border",
                        isPinnedRight && "sticky right-0 z-30 bg-background border-l-2 border-border",
                        !isPinnedLeft && !isPinnedRight && "bg-muted/50"
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {renderHeader(header, togglePin, isPinned)}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {virtualRows.length > 0 ? (
              <>
                {/* Top padding */}
                {virtualRows[0]?.start > 0 && (
                  <tr>
                    <td colSpan={table.getAllLeafColumns().length} style={{ height: virtualRows[0].start }} />
                  </tr>
                )}

                {/* Visible rows */}
                {virtualRows.map(virtualRow => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map(cell => {
                        const isPinnedLeft = pinnedColumns.left.includes(cell.column.id);
                        const isPinnedRight = pinnedColumns.right.includes(cell.column.id);

                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-3 py-2 truncate",
                              isPinnedLeft && "sticky left-0 bg-background border-r",
                              isPinnedRight && "sticky right-0 bg-background border-l"
                            )}
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Bottom padding */}
                {virtualRows[virtualRows.length - 1] && (
                  <tr>
                    <td
                      colSpan={table.getAllLeafColumns().length}
                      style={{
                        height: totalSize - virtualRows[virtualRows.length - 1].end,
                      }}
                    />
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="text-center py-4 text-muted-foreground"
                >
                  Loading more...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to render header with controls
function renderHeader(header: any, togglePin: any, isPinned: any) {
  const pinStatus = isPinned(header.column.id);

  return (
    <div className="flex items-center gap-1 px-3 py-2 font-medium relative">
      {/* Drag handle */}
      <div className="cursor-move opacity-50 hover:opacity-100">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Column header */}
      <div className="flex-1 min-w-0">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-1">
        {header.column.getCanSort() && (
          <button
            onClick={header.column.getToggleSortingHandler()}
            className="hover:bg-muted rounded p-1"
          >
            {header.column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : header.column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </button>
        )}

        {/* Column menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted rounded p-1">
              <Settings2 className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => togglePin(header.column.id, 'left')}>
              <Pin className={cn("mr-2 h-4 w-4", pinStatus === 'left' && "text-primary")} />
              Pin Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePin(header.column.id, 'right')}>
              <Pin className={cn("mr-2 h-4 w-4 rotate-90", pinStatus === 'right' && "text-primary")} />
              Pin Right
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => header.column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={cn(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
          "hover:bg-primary/50",
          header.column.getIsResizing() && "bg-primary"
        )}
      />
    </div>
  );
}
