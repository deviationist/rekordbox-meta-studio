import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { Track } from '@/types/rekordbox/track';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

type PageProps = {
  librarySupportsArtwork: boolean;
  data: PageData;
  filters: Filters;
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
}

export default function Index({ librarySupportsArtwork, data, filters }: PageProps) {
  const route = useRoute();
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
        <Table<Track, Filters>
          columns={columnConfig({ includeArtwork: librarySupportsArtwork })}
          data={items}
          meta={meta}
          endpoint="/tracks"
          filters={filters}
          storageKey="tracks-table-state"
        />
      </div>
    </AppLayout>
  );
}
