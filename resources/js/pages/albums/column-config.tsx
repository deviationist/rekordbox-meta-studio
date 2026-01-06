import { ColumnDef } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Album } from '@/types/rekordbox/album';
import { dateColumns } from '@/components/table/common-columns/dates';

export const columnConfig: ColumnDef<Album>[] = [
  {
    accessorKey: 'name',
    header: 'Album Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  {
    accessorKey: 'trackCount',
    header: 'Track Count',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('trackCount')),
  },
  ...dateColumns<Album>(),
];
