import { Table } from "@tanstack/react-table";
import { ColumnSetStateCallbacks } from "./use-column-state";
import { Direction } from "./use-column-dnd-reordering";

export function useColumnReordering<TData>(table: Table<TData>, setState: ColumnSetStateCallbacks) {

  // Helper function to build current column order
  const buildCurrentColumnOrder = (savedOrder: string[], allColumnIds: string[]): string[] => {
    // Start with existing order, or initialize if empty
    let currentOrder = savedOrder.length === 0 ? allColumnIds : [...savedOrder];

    // Append any new columns to the end
    const newColumns = allColumnIds.filter(id => !currentOrder.includes(id));
    currentOrder = [...currentOrder, ...newColumns];

    // Remove columns that no longer exist
    currentOrder = currentOrder.filter(id => allColumnIds.includes(id));

    return currentOrder;
  };

  // Helper function to reorder an array
  const reorderArray = (
    array: string[],
    draggedId: string,
    targetId: string,
    side: Direction
  ): string[] => {
    const newArray = [...array];
    const draggedIndex = newArray.indexOf(draggedId);
    const targetIndex = newArray.indexOf(targetId);

    // If either not found, return unchanged
    if (draggedIndex === -1 || targetIndex === -1) {
      return newArray;
    }

    // Remove dragged item
    newArray.splice(draggedIndex, 1);

    // Insert at new position
    const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    const insertIndex = side === 'left' ? adjustedTargetIndex : adjustedTargetIndex + 1;
    newArray.splice(insertIndex, 0, draggedId);

    return newArray;
  };

  // Now the main function is clean
  const reorderColumn = (draggedColumnId: string, targetColumnId: string, side: Direction) => {
    setState.columnOrder((old) => {
      const allColumnIds = table.getVisibleLeafColumns().map(col => col.id);
      const currentOrder = buildCurrentColumnOrder(old, allColumnIds);
      return reorderArray(currentOrder, draggedColumnId, targetColumnId, side);
    });
  };

  return { reorderColumn };
}
