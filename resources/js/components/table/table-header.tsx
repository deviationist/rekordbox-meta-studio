import {
  flexRender,
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

// Helper function to render header with controls
export function renderHeader(header: any, togglePin: any, isPinned: any) {
  const pinStatus = isPinned(header.column.id);

  return (
    <div className="flex items-center px-1.5 py-2 font-medium relative">
      {/* Drag handle */}
      <div className="cursor-move opacity-50 hover:opacity-100 flex-shrink-0 pr-0.5">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Column header */}
      <div className="flex-1 min-w-0 text-sm truncate" title={header.column.columnDef.header as string}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {header.column.getCanSort() && (
          <button
            onClick={header.column.getToggleSortingHandler()}
            className="hover:bg-muted cursor-pointer rounded py-1 px-0.5"
          >
            {header.column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : header.column.getIsSorted() === 'desc' ? (
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
            <DropdownMenuItem onClick={() => togglePin(header.column.id, 'left')}>
              <Pin className={cn("mr-2 h-4 w-4", pinStatus === 'left' && "text-primary")} />
              Pin Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePin(header.column.id, 'right')}>
              <Pin className={cn("mr-2 h-4 w-4 rotate-90", pinStatus === 'right' && "text-primary")} />
              Pin Right
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => header.column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={cn(
          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
          "hover:bg-primary/50",
          header.column.getIsResizing() && "bg-primary"
        )}
      />
    </div>
  );
}
