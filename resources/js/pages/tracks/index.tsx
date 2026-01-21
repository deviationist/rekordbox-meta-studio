import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { Track } from '@/types/rekordbox/track';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';
import { useLibrary } from '@/contexts/library-context';
import { ArtworkViewerProvider } from '@/contexts/artwork-viewer-context';
import { ArtistFilter } from '@/components/table/filters/artist-filter';
import { FilterState } from '@/types/table';
import { AlbumFilter } from '@/components/table/filters/album-filter';
import { GenreFilter } from '@/components/table/filters/genre-filter';
import { AlbumArtistFilter } from '@/components/table/filters/album-artist-filter';
import { LabelFilter } from '@/components/table/filters/label-filter';
import { RemixerFilter } from '@/components/table/filters/remixer-filter';
import { ComposerFilter } from '@/components/table/filters/composer-filter';
import { KeyFilter } from '@/components/table/filters/key-filter';
import { PlaylistFilter } from '@/components/table/filters/playlist-filter';
import { FileTypeFilter } from '@/components/table/filters/file-type-filter';
import { BpmFilter } from '@/components/table/filters/bpm-filter';
import { DurationFilter } from '@/components/table/filters/duration-filter';
import { RatingFilter } from '@/components/table/filters/rating-filter';
import { AudioQualityFilter } from '@/components/table/filters/audio-quality-filter';
import { ReleaseYearFilter } from '@/components/table/filters/release-year-filter';
import { FileSizeFilter } from '@/components/table/filters/file-size-filter';
import { ReleaseDateFilter } from '@/components/table/filters/release-date-filter';
import { DateCreatedFilter } from '@/components/table/filters/date-created-filter';
import { OriginalArtistFilter } from '@/components/table/filters/original-artist-filter';
import { StockDateFilter } from '@/components/table/filters/stock-date-filter';
import { PlayCountFilter } from '@/components/table/filters/play-count-filter';
import { ArtworkFilter } from '@/components/table/filters/artwork-filter';
import { TagFilter } from '@/components/table/filters/tag-filter';

type PageProps = {
  data: PageData;
  filters: Filters;
  meta: PaginationMeta;
}

type PageData = {
  data: Track[];
  meta: PaginationMeta;
}

type Filters = {
  search?: string;
  genre?: string;
  min_bpm?: number;
  max_bpm?: number;
  key?: string;
  min_rating?: number;

  artists?: FilterState['artists'];
}

export default function Index({ data }: PageProps) {
  const route = useRoute();
  const [library] = useLibrary();
  const { meta, data: items } = data;
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { title: 'Library' },
    {
      title: 'Tracks',
      href: route('library.tracks.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tracks" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <ArtworkViewerProvider>
          <Table<Track, Filters>
            columns={columnConfig({ includeArtwork: library?.supports?.artwork })}
            data={items}
            meta={meta}
            endpoint={route('library.tracks.index')}
            filterComponents={[
              <ArtistFilter />,
              <ArtworkFilter />,
              <AlbumArtistFilter />,
              <OriginalArtistFilter />,
              <RemixerFilter />,
              <ComposerFilter />,
              <PlaylistFilter />,
              <TagFilter />,
              <FileTypeFilter />,
              <FileSizeFilter />,
              <KeyFilter />,
              <BpmFilter />,
              <PlayCountFilter />,
              <AudioQualityFilter />,
              <ReleaseYearFilter />,
              <ReleaseDateFilter />,
              <DateCreatedFilter />,
              <StockDateFilter />,
              <DurationFilter />,
              <RatingFilter />,
              <LabelFilter />,
              <AlbumFilter />,
              <GenreFilter />,
            ]}
            storageKey="tracks-table-state"
          />
        </ArtworkViewerProvider>
      </div>
    </AppLayout>
  );
}
