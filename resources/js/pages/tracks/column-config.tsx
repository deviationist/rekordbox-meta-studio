import { ColumnDef } from '@tanstack/react-table';
import { Genre } from '@/types/rekordbox/genre';
import { Album } from '@/types/rekordbox/album';
import { Artist } from '@/types/rekordbox/artist';
import { Key } from '@/types/rekordbox/key';
import { Track } from '@/types/rekordbox/track';
import { formatFileSize } from './helpers';
import { displayValue } from '@/components/table/utils';
import { Artwork } from '@/components/table/common-columns/renderers/artwork';
import { DateCell } from '@/components/table/common-columns/renderers/date';
import { NamedItem } from '@/components/table/common-columns/renderers/named-item';
import { Rating } from '@/components/table/common-columns/renderers/rating';
import { createColumnHelper } from '@tanstack/react-table';
import { ScaleKeyBadge } from '@/components/scale-key-badge';

const columnHelper = createColumnHelper<Track>();

type ColumnConfigProps = {
  includeArtwork?: boolean;
}

export const columnConfig = ({ includeArtwork }: ColumnConfigProps): ColumnDef<Track>[] => [
  ...(includeArtwork
    ? [columnHelper.display({
        id: 'artwork',
        header: 'Artwork',
        enableSorting: false,
        size: 200,
        meta: {
          padding: false,
        },
        cell: ({ row, table }) => <Artwork table={table} row={row} />,
      })]
    : []),
  {
    accessorKey: 'title',
    header: 'Track Title',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('title')),
  },
  {
    accessorKey: 'artist',
    header: 'Artist',
    size: 250,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('artist')} />,
  },
  {
    accessorKey: 'album',
    header: 'Album',
    size: 200,
    cell: ({ row }) => <NamedItem<Album> namedItem={row.getValue('album')} />,
  },
  {
    accessorKey: 'albumArtist',
    header: 'Album Artist',
    size: 200,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('albumArtist')} />,
  },
  {
    accessorKey: 'label',
    header: 'Label',
    size: 200,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('label')} />,
  },
  {
    accessorKey: 'bpm',
    header: 'BPM',
    size: 115,
    cell: ({ row }) => displayValue(row.getValue('bpm'), (bpm) => (
      <div className="text-right tabular-nums">
        {(bpm / 100).toFixed(2)}
      </div>
    )),
  },
  {
    accessorKey: 'bitRate',
    header: 'Bitrate',
    size: 125,
    cell: ({ row }) => displayValue(row.getValue('bitRate'), (bitRate) => (
      <div className="text-right text-sm tabular-nums text-muted-foreground">
        {bitRate} kbps
      </div>
    )),
  },
  {
    accessorKey: 'bitDepth',
    header: 'Bitdepth',
    size: 140,
    cell: ({ row }) => displayValue(row.getValue('bitDepth')),
  },
  {
    accessorKey: 'sampleRate',
    header: 'Sample Rate',
    size: 165,
    cell: ({ row }) => displayValue(row.getValue('sampleRate'), (sampleRate) => (
      <div className="text-right text-sm tabular-nums text-muted-foreground">
        {(sampleRate / 1000).toFixed(1)} kHz
      </div>
    )),
  },
  {
    accessorKey: 'originalArtist',
    header: 'Original Artist',
    size: 200,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('originalArtist')} />,
  },
  {
    accessorKey: 'remixer',
    header: 'Remixer',
    size: 150,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('remixer')} />,
  },
  {
    accessorKey: 'releaseYear',
    header: 'Release Year',
    size: 160,
    cell: ({ row }) => displayValue(row.getValue('releaseYear')),
  },
  {
    accessorKey: 'releaseDate',
    header: 'Release Date',
    size: 200,
    cell:({ row }) => <DateCell date={row.getValue('releaseDate')} />,
  },
  {
    accessorKey: 'composer',
    header: 'Composer',
    size: 150,
    cell: ({ row }) => <NamedItem<Artist> namedItem={row.getValue('composer')} />,
  },
  {
    accessorKey: 'lyricist',
    header: 'Lyricist',
    size: 150,
    cell: ({ row }) => displayValue(row.getValue('lyricist')),
  },
  {
    accessorKey: 'genre',
    header: 'Genre',
    size: 125,
    cell: ({ row }) => <NamedItem<Genre> namedItem={row.getValue('genre')} />,
  },
  {
    accessorKey: 'key',
    header: 'Key',
    size: 105,
    cell: ({ row }) => displayValue(row.getValue('key'), (key: Key) =>
      <ScaleKeyBadge scaleName={key.scaleName} label={key.scaleName} />
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Time',
    size: 115,
    cell: ({ row }) => displayValue(row.getValue('duration'), (value) => (
      <div className="text-right tabular-nums font-mono text-sm">
        {value}
      </div>
    )),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    size: 125,
    cell: ({ row }) => <Rating<Track> row={row} />
  },
  {
    accessorKey: 'fileSize',
    header: 'File Size',
    size: 135,
    cell: ({ row }) => displayValue(row.getValue('fileSize'), (value) => (
      <div className="text-right tabular-nums">
          {formatFileSize(value)}
        </div>
    )),
  },
  {
    accessorKey: 'fileType',
    header: 'File Type',
    size: 140,
    cell: ({ row }) => displayValue(row.getValue('fileType')),
  },
  {
    accessorKey: 'fileName',
    header: 'File Name',
    size: 170,
    cell: ({ row }) => displayValue(row.getValue('fileName')),
  },
  {
    accessorKey: 'playCount',
    header: 'Play Count',
    size: 150,
    cell: ({ row }) => displayValue(row.getValue('playCount'), (value) => (
      <div className="text-right tabular-nums">
        {value}
      </div>
    )),
  },
  {
    accessorKey: 'dateCreated',
    header: 'Created At',
    size: 150,
    cell:({ row }) => <DateCell date={row.getValue('dateCreated')} />,
  },
  {
    accessorKey: 'color',
    header: 'Color',
    size: 120,
    cell: ({ row }) => displayValue(row.getValue('color'), (color) => (
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: color }}
        />
      </div>
    )),
  },
  {
    accessorKey: 'comment',
    header: 'Comment',
    size: 250,
    cell: ({ row }) => displayValue(row.getValue('comment'), (comment) => (
      <div className="truncate text-sm text-muted-foreground" title={comment}>
        {comment}
      </div>
    )),
  },
  {
    accessorKey: 'filePath',
    header: 'File Path',
    size: 300,
    cell: ({ row }) => displayValue(row.getValue('filePath'), (filePath) => (
      <div className="truncate text-xs font-mono text-muted-foreground" title={filePath}>
        {filePath}
      </div>
    )),
  },
];
