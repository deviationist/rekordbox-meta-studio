import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { router } from '@inertiajs/react';
import { Page } from '@inertiajs/core'
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { UseColumnState, useColumnState } from './hooks/use-column-state';
import { TableToolbar } from './table-toolbar/table-toolbar';
import { TableHeader } from './table-header/table-header';
import { useTableGridColumns } from './hooks/use-table-grid-columns';
import { useDetectColumnsOverflow } from './hooks/use-detect-columns-overflow';
import { TableBody } from './table-body/table-body';
import type { FilterState, GenericPageProps, TableProps, PaginationMeta } from './types';
import { UseSortingState, useSortingState } from './hooks/use-sorting-state';

export { PaginationMeta };

export type TableState = {
  sortingState: UseSortingState;
  columnState: UseColumnState;
};

export function Table<
  TData,
  TFilter extends FilterState,
>({
  columns,
  data,
  meta,
  endpoint,
  filters = {} as TFilter,
  filterComponents,
  storageKey = 'table-state',
}: TableProps<TData, Partial<TFilter>>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const [columnOverflow, setColumnOverflow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allData, setAllData] = useState<TData[]>(data);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta>(meta);
  const [hasMore, setHasMore] = useState<boolean>(meta.current_page < meta.last_page);

  // Column state
  const columnState = useColumnState({ storageKey });
  const {
    columnOrder,
    columnVisibility,
    columnSizing,
    columnPinning,
    setState: setColumnState,
  } = columnState;

  //useEffect(() => setAllData([]), [search])

  // Sorting
  const tableSorting = useSortingState();
  const { sortingState: sorting, currentSort, setSorting } = tableSorting;

  const tableState = { sortingState: tableSorting, columnState };

  const table = useReactTable({
    data: allData,
    columns,
    state: {
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
      columnPinning,
    },
    meta: {
      columnOverflow,
      currentSort,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnState.columnOrder,
    onColumnVisibilityChange: setColumnState.columnVisibility,
    onColumnSizingChange: setColumnState.columnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: false,
    manualSorting: true,
    enableSorting: true,
    enableSortingRemoval: true,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
  });

  const { rows } = table.getRowModel();

  //console.log("filters", filters);

  // Virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  const { totalColumnsWidth, gridTemplateColumns } = useTableGridColumns(table);

  useDetectColumnsOverflow({
    totalColumnsWidth,
    tableContainerRef,
    onChange: setColumnOverflow,
  });

  const query = useMemo(() => {
    const query: Record<string, string | number> = {};
    if (currentSort) {
      query.sort_by = currentSort.id;
      query.sort_order = currentSort.desc ? 'desc' : 'asc';
    }
    if (page) {
      query.page = page;
    }
    if (search) {
      query.search = search;
    }
    return query;
  }, [search, page, currentSort]);

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setPage(currentMeta.current_page + 1);

    router.get(
      endpoint,
      query,
      {
        preserveState: true,
        preserveScroll: true,
        only: ['data', 'meta'],
        onSuccess: (page) => {
          const props = page.props.data as Page<GenericPageProps<TData>>["props"];
          const newData = props.data || [];
          const newMeta = props.meta || currentMeta;

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
  }, [currentMeta, query, setPage, endpoint, hasMore, isLoading]);

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

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div className="space-y-4">
      <TableToolbar<TData>
        allData={allData}
        currentMeta={currentMeta}
        tableState={tableState}
        table={table}
        filterComponents={filterComponents}
      />

      <p>Search: {search}</p>
      <p>Page: {page}</p>
      <p>Sort: {JSON.stringify(sorting)}</p>
      <p>Query: {JSON.stringify(query)}</p>

      <div
        ref={tableContainerRef}
        className="relative overflow-auto border rounded-lg"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div style={{ minWidth: `${totalColumnsWidth}px` }}>
          <TableHeader<TData>
            table={table}
            tableState={tableState}
            gridTemplateColumns={gridTemplateColumns}
          />
          <TableBody<TData>
            isLoading={isLoading}
            rows={rows}
            tableState={tableState}
            virtualRows={virtualRows}
            totalSize={totalSize}
            gridTemplateColumns={gridTemplateColumns}
          />
        </div>
      </div>
    </div>
  );
}

