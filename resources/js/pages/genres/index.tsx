import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Genre } from '@/types/rekordbox/genre';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { useRoute } from '@/hooks/use-route';
import { useMemo } from 'react';

type PageProps = {
  data: PageData;
  filters: Filters;
}

type PageData = {
  data: Genre[];
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
      title: 'Genres',
      href: route('library.genres.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Genres" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Table<Genre, Filters>
          columns={columnConfig}
          data={items}
          meta={meta}
          endpoint="/genres"
          filters={filters}
          storageKey="genres-table-state"
        />
      </div>
    </AppLayout>
  );
}
