import { ColumnDef } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Label } from '@/types/rekordbox/label';
import { dateColumns } from '@/components/table/common-columns/dates';
import { Genre } from '@/types/rekordbox/genre';

export const columnConfig: ColumnDef<Label>[] = [
  {
    accessorKey: 'name',
    header: 'Genre Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  {
    accessorKey: 'artistCount',
    header: 'Artist Count',
    size: 160,
    cell: ({ row }) => displayValue(row.getValue('artistCount')),
  },
  {
    accessorKey: 'trackCount',
    header: 'Track Count',
    size: 160,
    cell: ({ row }) => displayValue(row.getValue('trackCount')),
  },
  ...dateColumns<Genre>(),
];
