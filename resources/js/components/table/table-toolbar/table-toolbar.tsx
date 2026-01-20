import { Table } from '@tanstack/react-table';
import { TableState } from '../table';
import { PaginationMeta } from '../types';
import { ColumnControl } from './column-control/column-control';
import { Fragment, JSX } from 'react';
import { SearchField } from './search-field';
import { SortBy } from './sort-by';

interface TableToolbarProps<TData> {
  allData: TData[];
  filterComponents?: Array<React.ComponentType | JSX.Element>;
  tableState: TableState;
  currentMeta: PaginationMeta;
  table: Table<TData>;
}

export function TableToolbar<TData>({
  allData,
  filterComponents = [],
  tableState,
  currentMeta,
  table,
}: TableToolbarProps<TData>) {
  return (
    <div className="grid gap-3">
      {/* Record count - always on top */}
      <div className="text-sm text-muted-foreground">
        Showing {allData?.length ? allData.length.toLocaleString() : 0} of{' '}
        {currentMeta.total.toLocaleString()} records
      </div>

      {/* Filters grid - responsive */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-3">
        {filterComponents.map((Component, index) => (
          typeof Component === 'function'
            ? <Component key={index} />
            : <Fragment key={index}>{Component}</Fragment>
        ))}
        <SortBy<TData> table={table} tableState={tableState} />
        <SearchField />
        <ColumnControl<TData> table={table} tableState={tableState} />
      </div>
    </div>
  );
}
