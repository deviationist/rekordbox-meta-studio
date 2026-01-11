import { Table } from "@tanstack/react-table";

export function useTableGridColumns<TData,>(table: Table<TData>) {
  // Calculate grid template columns
  const columnSizes = table.getVisibleLeafColumns().map(col => col.getSize());
  const totalColumnsWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  const gridTemplateColumns = table.getVisibleLeafColumns()
    .map((col, index, array) => {
      const isLast = index === array.length - 1;
      return isLast ? `minmax(${col.getSize()}px, 1fr)` : `${col.getSize()}px`;
    })
    .join(' ');

  return { totalColumnsWidth, gridTemplateColumns };
}
