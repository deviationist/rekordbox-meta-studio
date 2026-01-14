import { flexRender, Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";
import { cn } from '@/lib/utils';
import { TableState } from '../table';

type TableBodyProps<TData> = {
  isLoading: boolean;
  rows: Row<TData>[];
  tableState: TableState;
  virtualRows: VirtualItem[];
  totalSize: number;
  gridTemplateColumns: string;
}

export function TableBody<TData,>({ isLoading, rows, tableState, virtualRows, totalSize, gridTemplateColumns }: TableBodyProps<TData>) {
  const { columnState } = tableState;
  const { columnPinning } = columnState;
  return (
    <>
      {virtualRows.length > 0 ? (
        <>
          {/* Top padding */}
          {virtualRows[0]?.start > 0 && (
            <div style={{ height: virtualRows[0].start }} />
          )}

          {/* Visible rows */}
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                className="grid border-b hover:bg-muted/50 transition-colors"
                style={{ gridTemplateColumns }}
              >
                {row.getVisibleCells().map(cell => {
                  const isPinnedLeft = columnPinning.left?.includes(cell.column.id);
                  const isPinnedRight = columnPinning.right?.includes(cell.column.id);
                  const meta = cell.column.columnDef.meta

                  return (
                    <div
                      key={cell.id}
                      className={cn(
                        meta?.padding !== false ? "px-1.5 py-1" : "",
                        "inline-flex items-center text-sm truncate border-r last:border-r-0",
                        isPinnedLeft && "sticky left-0 bg-background",
                        isPinnedRight && "sticky right-0 bg-background"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Bottom padding */}
          {virtualRows[virtualRows.length - 1] && (
            <div
              style={{
                height: totalSize - virtualRows[virtualRows.length - 1].end,
              }}
            />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No results found
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4 text-muted-foreground">
          Loading more...
        </div>
      )}
    </>
  );
}
