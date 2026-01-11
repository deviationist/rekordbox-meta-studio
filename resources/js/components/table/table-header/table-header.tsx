import { Table } from "@tanstack/react-table";
import { TableHeaderColumn } from "./table-header-column";
import { UseTableState } from "../hooks/use-table-state";
import { cn } from '@/lib/utils';
import { Direction } from "../hooks/use-column-dnd-reordering";
import { useState } from "react";
import { useColumnReordering } from "../hooks/use-column-reordering";

type TableHeaderProps<TData> = {
  table: Table<TData>;
  tableState: UseTableState;
  gridTemplateColumns: string;
};

export function TableHeader<TData,>({ table, tableState, gridTemplateColumns }: TableHeaderProps<TData>) {
  const { state, setState } = tableState;
  const dragState = useState<string | null>(null);

  // Column pinning helpers
  const togglePin = (columnId: string, side: Direction) => {
    setState.columnPinning(prev => {
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

  const isPinned = (columnId: string): Direction | false => {
    if (state.columnPinning.left?.includes(columnId)) return 'left';
    if (state.columnPinning.right?.includes(columnId)) return 'right';
    return false;
  };

  const { reorderColumn } = useColumnReordering(table, setState);

  return (
    <div
      className="sticky top-0 z-20 bg-background border-b grid"
      style={{ gridTemplateColumns }}
    >
      {table.getHeaderGroups().map(headerGroup => (
        headerGroup.headers.map(header => {
          const isPinnedLeft = state.columnPinning.left?.includes(header.column.id);
          const isPinnedRight = state.columnPinning.right?.includes(header.column.id);

          return (
            <div
              key={header.id}
              className={cn(
                "border-r last:border-r-0",
                isPinnedLeft && "sticky left-0 z-30 bg-background border-r-2 border-border",
                isPinnedRight && "sticky right-0 z-30 bg-background border-l-2 border-border",
                !isPinnedLeft && !isPinnedRight && "bg-muted/50"
              )}
            >
              <TableHeaderColumn<TData>
                reorderColumn={reorderColumn}
                dragState={dragState}
                table={table}
                header={header}
                togglePin={togglePin}
                isPinned={isPinned}
              />
            </div>
          );
        })
      ))}
    </div>
  );
}
