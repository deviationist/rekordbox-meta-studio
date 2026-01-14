import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { displayValue } from '@/components/table/utils';
import { Playlist } from '@/types/rekordbox/playlist';
import { Artwork } from '@/components/table/common-columns/renderers/artwork';
import { dateColumns } from '@/components/table/common-columns/dates';

const columnHelper = createColumnHelper<Playlist>();

type ColumnConfigProps = {
  includeArtwork?: boolean;
}

export const columnConfig = ({ includeArtwork }: ColumnConfigProps): ColumnDef<Playlist>[] => [
 ...(includeArtwork
    ? [columnHelper.display({
        id: 'artwork',
        header: 'Artwork',
        enableSorting: false,
        size: 200,
        meta: {
          padding: false,
        },
        cell: ({ row }) => <Artwork<Playlist> row={row} />
      })]
    : []),
  {
    accessorKey: 'name',
    header: 'Playlist Name',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('name')),
  },
  {
    accessorKey: 'itemCount',
    header: 'Track Count',
    size: 160,
    cell: ({ row }) => displayValue(row.getValue('itemCount')),
  },
  ...dateColumns<Playlist>(),
];
