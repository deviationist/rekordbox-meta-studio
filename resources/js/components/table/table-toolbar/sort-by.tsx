import { ArrowUp, ArrowDown, ChevronsUpDown, Settings2 } from 'lucide-react';
import { SortDirection, Table } from '@tanstack/react-table';
import { TableState } from '../table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/field';
import { InputWithCross } from '@/components/ui/input';

export interface ColumnControlProps<TData> {
  tableState: TableState;
  table: Table<TData>;
}

export function SortBy<TData>({
  tableState,
  table,
}: ColumnControlProps<TData>) {
  const { sortingState } = tableState;
  const [searchString, setSearchString] = useState<string>('');

  const initialColumns = useMemo(
    () => table.getAllLeafColumns().filter(col => col.getCanSort()).map(col => ({
      id: col.id,
      column: col,
    })),
    [table]
  );

  const sortByColumn = useMemo(
    () => initialColumns.find(e => e.id === sortingState.currentSort?.id),
    [initialColumns, sortingState.currentSort]
  );

  const sortOrder = useMemo<SortDirection>(
    () => sortingState.currentSort?.desc ? 'desc' : 'asc',
    [sortingState.currentSort]
  );

  const visibleColumns = useMemo(() => {
    return initialColumns.filter(({ column }) => {
      return (column.columnDef.header as string)
        .toLocaleLowerCase()
        .includes(searchString.toLocaleLowerCase());
    }).map(({ id }) => id);
  }, [initialColumns, searchString]);

  return (
    <div className="inline-flex gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {sortByColumn ? (
              <>Sort by {sortByColumn.column.columnDef.header as string}</>
            ) : (
              <>Sort</>
            )}
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          {sortByColumn && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => sortingState.resetSorting()}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Reset Sort
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <Field className="p-1">
            <InputWithCross
              placeholder="Column search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Field>
          <DropdownMenuSeparator />
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
            {initialColumns.map(({ id, column }) => (
              visibleColumns.includes(id) && (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={column.id === sortByColumn?.id}
                  onCheckedChange={() => {
                    sortingState.setSortBy(column.id);
                    setSearchString('');
                  }}
                  className="flex-1 cursor-pointer"
                >
                  {column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              )
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {sortByColumn && (
        <Button
          onClick={() => sortingState.toggleSortOrder()}
          variant="outline"
          size="sm"
          className="cursor-pointer"
          title={sortOrder === 'asc' ? 'Sorted ascending - click to reverse' : 'Sorted descending - click to reverse'}
        >
          <span>Order</span>
          {sortOrder === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
