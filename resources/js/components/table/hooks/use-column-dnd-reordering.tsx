import { Column, Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

export type Direction = 'left' | 'right';

export type UseColumnDndProps<TData> = {
  dragState: [string | null, Dispatch<SetStateAction<string | null>>];
  dragHandleRef: React.RefObject<HTMLDivElement | null>;
  table: Table<TData>;
  column: Column<TData, unknown>;
  columnReorderCallback: (draggedColumnId: string, targetColumnId: string, side: Direction) => void;
}

export function useColumnDndReordering<TData>({
  dragState,
  dragHandleRef,
  table,
  column,
  columnReorderCallback
}: UseColumnDndProps<TData>) {
  const [draggedOver, setDraggedOver] = useState<Direction | null>(null);
  const [draggedColumnId, setDraggedColumnId] = dragState;
  const isBeingDragged = draggedColumnId === column.id;

  const { resolveSide } = useSideResolver({ table, column });

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', column.id);
    setDraggedColumnId(column.id);

    // Create a custom drag image from the entire header
    if (dragHandleRef.current) {
      const clone = createColumnClone(dragHandleRef.current, dragHandleRef.current.offsetWidth);
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      // Clean up the clone after drag starts
      setTimeout(() => document.body.removeChild(clone), 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // Don't show drop indicator if we're hovering over the source column
    const sourceDraggedColumnId = e.dataTransfer.getData('text/plain') || draggedColumnId;
    if (sourceDraggedColumnId === column.id) {
      setDraggedOver(null);
      return;
    }

    e.dataTransfer.dropEffect = 'move';

    setDraggedOver(resolveSide(e, sourceDraggedColumnId));
  };

  const handleDragLeave = () => setDraggedOver(null);
  const handleDragEnd = () => setDraggedColumnId(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceDraggedColumnId = e.dataTransfer.getData('text/plain');
    if (sourceDraggedColumnId !== column.id) {
      columnReorderCallback(
        sourceDraggedColumnId,
        column.id,
        resolveSide(e, sourceDraggedColumnId)
      );
    }
    setDraggedOver(null);
    setDraggedColumnId(null);
  };

  const DropIndicator = () => {
    if (isBeingDragged || !draggedOver) return null;
    const side = draggedOver === 'left' ? '-left-0.5' : '-right-0.5';
    return <div className={`absolute ${side} top-0 bottom-0 w-[3px] bg-primary z-10`} />;
  };

  return {
    isBeingDragged,
    DropIndicator,
    handles: {
      dragStart: handleDragStart,
      dragOver: handleDragOver,
      dragLeave: handleDragLeave,
      dragEnd: handleDragEnd,
      drop: handleDrop,
    },
  };
};

function createColumnClone(element: HTMLDivElement, elementWidth: number) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.width = `${elementWidth}px`;
  clone.style.opacity = '0.8';
  clone.style.backgroundColor = 'hsl(var(--background))';
  clone.style.border = '1px solid hsl(var(--border))';
  clone.style.borderRadius = '0.375rem';
  return clone;
}

function determineDragOverMidpoint(e: React.DragEvent): Direction {
  const rect = e.currentTarget.getBoundingClientRect();
  const midpoint = rect.left + rect.width / 2;
  return e.clientX < midpoint ? 'left' : 'right';
}

type useSideResolverProps<TData> = {
  table: Table<TData>;
  column: Column<TData, unknown>;
}

function useSideResolver<TData>({ table, column }: useSideResolverProps<TData>) {
  const { isNextColumn, isPrevColumn } = useMemo(() => {
    const getColumnIndices = (sourceDraggedColumnId: string | null) => {
      if (!sourceDraggedColumnId) return null;
      const allColumns = table.getVisibleLeafColumns();
      const sourceIndex = allColumns.findIndex(col => col.id === sourceDraggedColumnId);
      const currentIndex = allColumns.findIndex(col => col.id === column.id);
      if (sourceIndex === -1 || currentIndex === -1) return null;
      return { sourceIndex, currentIndex };
    };

    return {
      isNextColumn: (sourceDraggedColumnId: string | null) => {
        if (!sourceDraggedColumnId) return;
        const indices = getColumnIndices(sourceDraggedColumnId);
        return indices ? indices.sourceIndex === indices.currentIndex - 1 : false;
      },
      isPrevColumn: (sourceDraggedColumnId: string | null) => {
        if (!sourceDraggedColumnId) return;
        const indices = getColumnIndices(sourceDraggedColumnId);
        return indices ? indices.sourceIndex === indices.currentIndex + 1 : false;
      }
    };
  }, [table, column]);

  const resolveSide = (e: React.DragEvent, sourceDraggedColumnId: null|string): Direction => {
    if (sourceDraggedColumnId && isNextColumn(sourceDraggedColumnId)) {
      return 'right'; // Dragging over immediate next column (one step to the right)
    } else if(sourceDraggedColumnId && isPrevColumn(sourceDraggedColumnId)) {
      return 'left'; // Dragging over immediate prev column (one step to the left)
    }
    return determineDragOverMidpoint(e);
  };

  return { resolveSide };
}
