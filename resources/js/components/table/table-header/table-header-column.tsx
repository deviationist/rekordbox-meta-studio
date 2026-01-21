import {
  flexRender,
  Header,
  SortDirection,
  Table,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, EyeOff, GripVertical, Pin, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { Direction, useColumnDndReordering } from '../hooks/use-column-dnd-reordering';
import { TableState } from '../table';
import { useColumnReordering } from '../hooks/use-column-reordering';

type Props<TData> = {
  tableState: TableState;
  dragState: [string | null, Dispatch<SetStateAction<string | null>>];
  table: Table<TData>,
  header: Header<TData, unknown>,
}

export function TableHeaderColumn<TData>({
  tableState,
  dragState,
  table,
  header,
}: Props<TData>) {
  const { column } = header;
  const { state: columnState, setState: setColumnState } = tableState.columnState;
  const { currentSort } = tableState.sortingState;

  const pinStatus = useMemo((): Direction | false => {
    if (columnState.columnPinning.left?.includes(column.id)) return 'left';
    if (columnState.columnPinning.right?.includes(column.id)) return 'right';
    return false;
  }, [columnState, column.id]);
  const isPinnedLeft = useMemo<boolean>(() => pinStatus === 'left', [pinStatus]);
  const isPinnedRight = useMemo<boolean>(() => pinStatus === 'right', [pinStatus]);
  const isPinned = isPinnedLeft || isPinnedRight;

  const isSorted = useMemo((): SortDirection | false => {
    if (currentSort?.id === column.id) {
      return currentSort.desc ? 'desc' : 'asc';
    }
    return false;
  }, [currentSort, column.id]);

  const isLastColumn = column.id === table.getVisibleLeafColumns().at(-1)?.id;

  // Column pinning helpers
  const togglePin = (columnId: string, side: Direction) => {
    setColumnState.columnPinning(prev => {
      const newPinned = { ...prev };
      const otherSide = side === 'left' ? 'right' : 'left';

      // Remove from other side
      newPinned[otherSide] = newPinned[otherSide]?.filter(id => id !== columnId);

      // Toggle on current side
      if (newPinned[side]?.includes(columnId)) {
        newPinned[side] = newPinned[side]?.filter(id => id !== columnId);
      } else {
        newPinned[side] = [...newPinned[side] ?? [], columnId];
      }

      return newPinned;
    });
  };

  const { reorderColumn } = useColumnReordering(table, setColumnState);

  const columnCanBeResized = useMemo<boolean>(
    () => column.getCanResize() && (!isLastColumn || !!table.options.meta?.columnOverflow),
    [column, isLastColumn, table.options.meta?.columnOverflow]
  );

  const dragHandleRef = useRef<HTMLDivElement>(null);
  const {
    isBeingDragged,
    DropIndicator,
    handles,
  } = useColumnDndReordering({
    dragState,
    dragHandleRef,
    table,
    column,
    columnReorderCallback: reorderColumn,
  });

  const columnContent = useMemo(() => (
    <div className="flex-1 min-w-0 text-sm truncate" title={column.columnDef.header as string}>
      {flexRender(column.columnDef.header, header.getContext())}
    </div>
  ), [column.columnDef.header, header]);

  return (
    <div
      className={cn(
        "border-r last:border-r-0",
        isPinnedLeft && "sticky left-0 z-30 bg-background border-r-2 border-border",
        isPinnedRight && "sticky right-0 z-30 bg-background border-l-2 border-border",
        !isPinnedLeft && !isPinnedRight && "bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex items-center px-1.5 py-2 font-medium relative",
          isBeingDragged && "opacity-50"
        )}
        onDragOver={handles.dragOver}
        onDragLeave={handles.dragLeave}
        onDrop={handles.drop}
      >
        {isPinned ? columnContent : (
          <>
            {/* Drop indicator - only show if not the source column */}
            <DropIndicator />

            {/* Drag handle */}
            <div className="flex items-center truncate flex-1" ref={dragHandleRef}>
              <div
                className="cursor-move opacity-50 hover:opacity-100 flex-shrink-0 pr-0.5"
                draggable
                onDragStart={handles.dragStart}
                onDragEnd={handles.dragEnd}
              >
                <GripVertical className="h-4 w-4" />
              </div>

              {columnContent}
            </div>
          </>
        )}

        {/* Sort indicator */}
        <div className="flex items-center gap-1 flex-shrink-0">

          {column.getCanSort() && (
            <button
              onClick={column.getToggleSortingHandler()}
              className="hover:bg-muted cursor-pointer rounded py-1 px-0.5"
            >
              {isSorted === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : isSorted === 'desc' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              )}
            </button>
          )}

          {/* Column menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-muted cursor-pointer rounded px-1 h-6">
                <Settings2 className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => togglePin(column.id, 'left')}>
                <Pin className={cn("mr-2 h-4 w-4", isPinnedLeft && "text-primary")} />
                Pin Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => togglePin(column.id, 'right')}>
                <Pin className={cn("mr-2 h-4 w-4 rotate-90", isPinnedRight && "text-primary")} />
                Pin Right
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Resize handle */}
        {columnCanBeResized && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={cn(
              "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
              "hover:bg-primary/50",
              header.column.getIsResizing() && "bg-primary"
            )}
          />
        )}
      </div>
    </div>
  );
}
