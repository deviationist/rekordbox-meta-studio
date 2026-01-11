import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Playlist } from '@/types/rekordbox/playlist';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

type PageProps = {
  librarySupportsArtwork: boolean;
  data: PageData;
  filters: Filters;
}

type PageData = {
  data: Playlist[];
  meta: PaginationMeta;
}

type Filters = {
  search?: string;
}

export default function Index({ librarySupportsArtwork, data, filters }: PageProps) {
  const route = useRoute();
  const { meta, data: items } = data;
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { title: 'Library' },
    {
      title: 'Playlists',
      href: route('library.playlists.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Playlists" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Table<Playlist, Filters>
          columns={columnConfig({ includeArtwork: librarySupportsArtwork })}
          data={items}
          meta={meta}
          endpoint="/playlists"
          filters={filters}
          storageKey="playlists-table-state"
        />
      </div>
    </AppLayout>
  );
}
