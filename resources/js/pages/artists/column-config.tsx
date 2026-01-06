import { ColumnDef } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Artist } from '@/types/rekordbox/artist';
import { dateColumns } from '@/components/table/common-columns/dates';

export const columnConfig: ColumnDef<Artist>[] = [
  {
    accessorKey: 'name',
    header: 'Artist Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  {
    accessorKey: 'trackCount',
    header: 'Track Count',
    size: 160,
    cell: ({ row }) => displayValue(row.getValue('trackCount')),
  },
  {
    accessorKey: 'albumCount',
    header: 'Album Count',
    size: 170,
    cell: ({ row }) => displayValue(row.getValue('albumCount')),
  },
  ...dateColumns<Artist>(),
];
