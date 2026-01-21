import { ChevronsUpDown, X, AArrowDown, AArrowUp, RotateCcw } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    <div className="inline-flex w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-0 w-full">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "cursor-pointer justify-start flex-1 min-w-0",
                sortByColumn ?  "rounded-r-none border-r-0" : "",
              )}
            >
              <ChevronsUpDown className="h-4 w-4" />
              {sortByColumn ? (
                <p className="truncate flex justify-start flex-1 min-w-0" title={sortByColumn.column.columnDef.header as string}>
                  {sortByColumn.column.columnDef.header as string}
                </p>
              ) : (
                <>Sort</>
              )}

            </Button>
            {sortByColumn && (
              <>
                <div className="w-px h-full border-r border-input" />
                <Button
                  onClick={() => sortingState.toggleSortOrder()}
                  onPointerDown={(e) => e.stopPropagation()}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-none border-x-0"
                  title={sortOrder === 'asc' ? 'Sorted ascending - click to reverse' : 'Sorted descending - click to reverse'}
                >
                  <span className="sr-only">Order</span>
                  {sortOrder === 'asc' ? (
                    <AArrowUp />
                  ) : (
                    <AArrowDown />
                  )}
                </Button>
                <div className="w-px h-full border-r border-input" />
                <Button
                  onClick={() => sortingState.resetSorting()}
                  onPointerDown={(e) => e.stopPropagation()}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-l-none border-l-0"
                  title={sortOrder === 'asc' ? 'Sorted ascending - click to reverse' : 'Sorted descending - click to reverse'}
                >
                  <X />
                </Button>
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
          {sortByColumn && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => sortingState.resetSorting()}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
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
          <ScrollArea className="h-[50vh]">
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
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
