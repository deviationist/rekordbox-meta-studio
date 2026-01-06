import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { playlists } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Playlist } from '@/types/rekordbox/playlist';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Library' },
  {
    title: 'Playlists',
    href: playlists.index().url,
  },
];

interface Props {
  data: {
    data: Playlist[];
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
  const { meta, data: items } = data;
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Playlists" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable<Playlist>
          columns={columnConfig}
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
