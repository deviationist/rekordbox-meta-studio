import { Table } from "@tanstack/react-table";

export function useTableGridColumns<TData>(table: Table<TData>) {
  // Get columns in their actual render order (respects pinning)
  const leftColumns = table.getLeftLeafColumns();
  const centerColumns = table.getCenterLeafColumns();
  const rightColumns = table.getRightLeafColumns();

  const allColumns = [...leftColumns, ...centerColumns, ...rightColumns];

  // Calculate grid template columns
  const columnSizes = allColumns.map(col => col.getSize());
  const totalColumnsWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  const gridTemplateColumns = allColumns
    .map((col, index, array) => {
      const isLast = index === array.length - 1;
      return isLast ? `minmax(${col.getSize()}px, 1fr)` : `${col.getSize()}px`;
    })
    .join(' ');

  return { totalColumnsWidth, gridTemplateColumns };
}
