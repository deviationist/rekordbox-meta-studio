import {
  flexRender,
  Header,
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

type Props<TData> = {
  dragState: [string | null, Dispatch<SetStateAction<string | null>>];
  table: Table<TData>,
  header: Header<TData, unknown>,
  togglePin: (columnId: string, side: "left" | "right") => void,
  isPinned: (columnId: string) => "left" | "right" | false,
  reorderColumn: (draggedColumnId: string, targetColumnId: string, side: Direction) => void;
}

export function TableHeaderColumn<TData,>({
  dragState,
  table,
  header,
  togglePin,
  isPinned,
  reorderColumn: columnReorderCallback,
}: Props<TData>) {
  const { column } = header;
  const pinStatus = isPinned(header.column.id);
  const isLastColumn = column.id === table.getVisibleLeafColumns().at(-1)?.id;

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
    columnReorderCallback,
  });

  return (
    <div
      className={cn(
        "flex items-center px-1.5 py-2 font-medium relative",
        isBeingDragged && "opacity-50"
      )}
      onDragOver={handles.dragOver}
      onDragLeave={handles.dragLeave}
      onDrop={handles.drop}
    >
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

        {/* Column header */}
        <div className="flex-1 min-w-0 text-sm truncate" title={column.columnDef.header as string}>
          {flexRender(column.columnDef.header, header.getContext())}
        </div>
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {column.getCanSort() && (
          <button
            onClick={column.getToggleSortingHandler()}
            className="hover:bg-muted cursor-pointer rounded py-1 px-0.5"
          >
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
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
              <Pin className={cn("mr-2 h-4 w-4", pinStatus === 'left' && "text-primary")} />
              Pin Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePin(column.id, 'right')}>
              <Pin className={cn("mr-2 h-4 w-4 rotate-90", pinStatus === 'right' && "text-primary")} />
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
  );
}
