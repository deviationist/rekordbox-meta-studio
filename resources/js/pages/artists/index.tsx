import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Artist } from '@/types/rekordbox/artist';
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
  data: Artist[];
  meta: PaginationMeta;
}

type Filters = {
  search?: string;
}

export default function Index({ data, filters }: PageProps) {
  const route = useRoute();
  const { meta, data: items } = data;
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { title: 'Library' },
    {
      title: 'Artists',
      href: route('library.artists.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Artists" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Table<Artist, Filters>
          columns={columnConfig}
          data={items}
          meta={meta}
          endpoint="/artists"
          filters={filters}
          storageKey="artists-table-state"
        />
      </div>
    </AppLayout>
  );
}
