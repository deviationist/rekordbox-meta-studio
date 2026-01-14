import { Table } from "@tanstack/react-table";
import { TableHeaderColumn } from "./table-header-column";
import { TableState } from '../table';
import { useState } from "react";

type TableHeaderProps<TData> = {
  table: Table<TData>;
  tableState: TableState;
  gridTemplateColumns: string;
};

export function TableHeader<TData>({ table, tableState, gridTemplateColumns }: TableHeaderProps<TData>) {
  const dragState = useState<string | null>(null);
  return (
    <>
      <div
        className="sticky top-0 z-20 bg-background border-b grid"
        style={{ gridTemplateColumns }}
      >
        {table.getFlatHeaders().map(header => (
          <TableHeaderColumn<TData>
            key={header.id}
            tableState={tableState}
            dragState={dragState}
            table={table}
            header={header}
          />
        ))}
        {/*table.getFlatHeaders().map(header => {
          void sortingState.sortingState;
          const isPinnedLeft = state.columnPinning.left?.includes(header.column.id);
          const isPinnedRight = state.columnPinning.right?.includes(header.column.id);

          return (
            <div
              key={header.id}
              className={cn(
                "border-r last:border-r-0",
                sortingState.sortingState?.[0] ? "sorted" : "not-sorted",
                isPinnedLeft && "sticky left-0 z-30 bg-background border-r-2 border-border",
                isPinnedRight && "sticky right-0 z-30 bg-background border-l-2 border-border",
                !isPinnedLeft && !isPinnedRight && "bg-muted/50"
              )}
            >
              "{header.column.getIsSorted()}" 2
              <TableHeaderColumn<TData>
                tableState={tableState}
                reorderColumn={reorderColumn}
                dragState={dragState}
                table={table}
                header={header}
                sortingState={table.getState().sorting}
                column={header.column}
                togglePin={togglePin}
                isPinned={isPinned}
              />
            </div>
          );
        })*/}
      </div>
    </>
  );
}
