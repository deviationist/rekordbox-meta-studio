import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { artists } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Artist } from '@/types/rekordbox/artist';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Library' },
  {
    title: 'Artists',
    href: artists.index().url,
  },
];

interface Props {
  data: {
    data: Artist[];
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
      <Head title="Artists" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable<Artist>
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
