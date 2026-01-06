import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Album } from '@/types/rekordbox/album';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

interface Props {
  data: {
    data: Album[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
  filters: {
    search?: string;
  };
}

export default function Index({ data, filters }: Props) {
  const route = useRoute();
  const { meta, data: items } = data;
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { title: 'Library' },
    {
      title: 'Albums',
      href: route('library.albums.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Albums" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable<Album>
          columns={columnConfig}
          data={items}
          meta={meta}
          endpoint="/albums"
          filters={filters}
          storageKey="albums-table-state"
        />
      </div>
    </AppLayout>
  );
}
