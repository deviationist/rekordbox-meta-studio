import { Table } from '@tanstack/react-table';
import { TableState } from '../table';
import { PaginationMeta } from '../types';
import { ColumnControl } from './column-control/column-control';
import { Fragment, JSX } from 'react';
import { SearchField } from './search-field';

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
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {allData?.length ? allData.length.toLocaleString() : 0} of{' '}
        {currentMeta.total.toLocaleString()} records
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        {filterComponents.map((Component, index) => (
          typeof Component === 'function'
            ? <Component key={index} />
            : <Fragment key={index}>{Component}</Fragment>
        ))}
        <SearchField />
        <ColumnControl<TData> table={table} tableState={tableState} />
      </div>
    </div>
  );
}
