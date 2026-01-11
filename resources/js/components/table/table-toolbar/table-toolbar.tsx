import { Settings2 } from 'lucide-react';
import { Table, TableState } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PaginationMeta } from '../types';
import { ColumnResetStateCallbacks } from '../hooks/use-table-state';

interface TableToolbarProps<TData> {
  allData: TData[];
  tableState: TableState;
  currentMeta: PaginationMeta;
  table: Table<TData>;
  resetState: ColumnResetStateCallbacks;
}

export function TableToolbar<TData>({ allData, tableState, currentMeta, table, resetState }: TableToolbarProps<TData>) {
  const columnVisibilityStateKey = JSON.stringify(tableState);
  return (
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
          <DropdownMenuItem onClick={() => resetState.columnVisibility()}>
            Reset Layout
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {table.getAllLeafColumns().map(column => (
            <DropdownMenuCheckboxItem
              key={`${column.id}-${columnVisibilityStateKey}`}
              checked={column.getIsVisible()}
              onCheckedChange={value => column.toggleVisibility(value)}
            >
              {column.columnDef.header as string}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
