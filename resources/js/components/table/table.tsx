import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { router } from '@inertiajs/react';
import { Page } from '@inertiajs/core'

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { useTableState } from './hooks/use-table-state';
import { TableToolbar } from './table-toolbar/table-toolbar';
import { TableHeader } from './table-header/table-header';
import { useTableGridColumns } from './hooks/use-table-grid-columns';
import { useDetectColumnsOverflow } from './hooks/use-detect-columns-overflow';
import { TableBody } from './table-body/table-body';

import type { GenericFilters, GenericPageProps, TableProps, PaginationMeta } from './types';
import { useTableSorting } from './hooks/use-table-sorting';

export { PaginationMeta };

export function Table<
  TData,
  TFilter extends GenericFilters,
>({
  columns,
  data,
  meta,
  endpoint,
  filters = {} as TFilter,
  filterMarkup,
  storageKey = 'table-state',
}: TableProps<TData, Partial<TFilter>>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const [columnOverflow, setColumnOverflow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allData, setAllData] = useState<TData[]>(data);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta>(meta);
  const [hasMore, setHasMore] = useState<boolean>(meta.current_page < meta.last_page);

  const tableState = useTableState({ storageKey });
  const {
    columnOrder,
    columnVisibility,
    columnSizing,
    columnPinning,
    setState,
    resetState,
  } = tableState;

  const { currentSort, toggleSort } = useTableSorting(
    { id: 'title', desc: false },
    () => {
      //fetchData(true)
    },
  );

  const table = useReactTable({
    data: allData,
    columns,
    state: {
      //sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
      columnPinning,
    },
    meta: {
      columnOverflow,
      currentSort,
      toggleSort,
    },
    //onSortingChange: setSorting,
    onColumnOrderChange: setState.columnOrder,
    onColumnVisibilityChange: setState.columnVisibility,
    onColumnSizingChange: setState.columnSizing,
    getCoreRowModel: getCoreRowModel(),
    //getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
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

  const { totalColumnsWidth, gridTemplateColumns } = useTableGridColumns(table);

  useDetectColumnsOverflow({
    totalColumnsWidth,
    tableContainerRef,
    onChange: setColumnOverflow,
  });

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentMeta.current_page + 1;
    setPage(nextPage);

    router.get(
      endpoint,
      { ...filters, page: nextPage, per_page: currentMeta.per_page },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['data', 'meta'],
        onSuccess: (page) => {
          const props = page.props as Page<GenericPageProps<TData>>["props"];
          const newData = props.data || [];
          console.log("newData", newData);
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
  }, [currentMeta, setPage, endpoint, filters, hasMore, isLoading]);

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
        filterMarkup={filterMarkup}
        allData={allData}
        currentMeta={currentMeta}
        tableState={table.getState()}
        table={table}
        resetState={resetState}
      />

      <p>Search: {search}</p>
      <p>Page: {page}</p>

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

