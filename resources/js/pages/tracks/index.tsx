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

type PageProps = {
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

export default function Index({ data, filters }: PageProps) {
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
            filters={filters}
            storageKey="tracks-table-state"
          />
        </ArtworkViewerProvider>
      </div>
    </AppLayout>
  );
}
