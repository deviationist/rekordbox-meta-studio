import { displayValue } from "../utils";
import { Row } from "@tanstack/react-table";
import { DateCell } from "./renderers/date";

export const dateColumns = <Type,>() => ([{
  accessorKey: 'createdAt',
  header: 'Created At',
  size: 150,
  cell:({ row }: { row: Row<Type>}) => <DateCell date={row.getValue("createdAt")} />,
},
{
  accessorKey: 'updatedAt',
  header: 'Updated At',
  size: 150,
  cell:({ row }: { row: Row<Type>}) => <DateCell date={row.getValue("updatedAt")} />,
}]);
