import { RotateCcw, Settings2 } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { TableState } from '../../table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/field';
import { InputWithCross } from '@/components/ui/input';
import { SortableColumnItem } from './sortable-column-item';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ColumnControlProps<TData> {
  tableState: TableState;
  table: Table<TData>;
}

export function ColumnControl<TData>({
  tableState,
  table,
}: ColumnControlProps<TData>) {
  const { columnState } = tableState;
  const [searchString, setSearchString] = useState<string>('');

  // Get initial column order
  const initialColumns = useMemo(
    () => table.getAllLeafColumns().map(col => ({
      id: col.id,
      column: col,
    })),
    [table]
  );

  const [columns, setColumns] = useState(initialColumns);
  const visibleColumns = useMemo(() => {
    return columns.filter(({ column }) => {
      return (column.columnDef.header as string).toLocaleLowerCase().includes(searchString.toLocaleLowerCase());
    }).map(({ id }) => id);
  }, [columns, searchString]);

  // Update columns when table columns change
  useMemo(() => {
    const newColumns = table.getAllLeafColumns().map(col => ({
      id: col.id,
      column: col,
    }));
    setColumns(newColumns);
  }, [table, columnState]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        table.setColumnOrder(newOrder.map(item => item.id));
        return newOrder;
      });
    }
  };

  const handleResetOrder = () => {
    const initialOrder = initialColumns.map(col => col.id);
    table.setColumnOrder(initialOrder);
    setColumns(initialColumns);
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer justify-start"
          size="sm"
        >
          <Settings2 className="h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer flex gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Options
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem className="cursor-pointer" onClick={() => columnState.resetState.columnVisibility()}>
              Reset Visibility
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleResetOrder}>
              Reset Order
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => columnState.resetState.columnSizing()}>
              Reset Resizing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => columnState.resetState.columnPinning()}>
              Reset Pinning
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => columnState.resetState.all()}>
              Reset All
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {columns.map(({ id, column }) => (
                visibleColumns.includes(id) &&
                <SortableColumnItem
                  key={id}
                  id={id}
                  isSortable={!searchString}
                  label={column.columnDef.header as string}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
