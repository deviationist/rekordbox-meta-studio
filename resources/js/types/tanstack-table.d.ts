import { RowData, ColumnSort } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface TableMeta<TData extends RowData> {
    columnOverflow: boolean;
    currentSort: ColumnSort | null;
    toggleSort: (columnId: string) => void;
  }

  // eslint-disable-next-line
  interface ColumnMeta<TData extends RowData, TValue> {
    padding?: boolean;
  }
}
