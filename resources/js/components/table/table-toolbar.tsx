import { Settings2 } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PaginationMeta } from './data-table';

interface DataTableToolbarProps<TData> {
  allData: TData[];
  currentMeta: PaginationMeta;
  table: Table<TData>;
  resetState: () => void;
}

export function TableToolbar<TData>({ allData, currentMeta, table, resetState }: DataTableToolbarProps<TData>) {
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
  );
}
