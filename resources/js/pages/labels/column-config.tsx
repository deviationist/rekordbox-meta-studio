import { ColumnDef } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Label } from '@/types/rekordbox/label';
import { dateColumns } from '@/components/table/common-columns/dates';

export const columnConfig: ColumnDef<Label>[] = [
  {
    accessorKey: 'name',
    header: 'Label Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  /*{
    accessorKey: 'trackCount',
    header: 'Track Count',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('trackCount')),
  },*/
  ...dateColumns<Label>(),
];
