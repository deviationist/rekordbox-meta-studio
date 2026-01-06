import { ColumnDef } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Playlist } from '@/types/rekordbox/playlist';
import { Artwork } from '@/components/table/common-columns/renderers/artwork';
import { dateColumns } from '@/components/table/common-columns/dates';

export const columnConfig: ColumnDef<Playlist>[] = [
  {
    accessorKey: 'artworkUrl',
    header: 'Artwork',
    enableSorting: false,
    size: 300,
    meta: {
      padding: false,
    },
    cell: ({ row }) => <Artwork<Playlist> row={row} />
  },
  {
    accessorKey: 'name',
    header: 'Playlist Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  {
    accessorKey: 'itemCount',
    header: 'Song Count',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('itemCount')),
  },
  ...dateColumns<Playlist>(),
];
