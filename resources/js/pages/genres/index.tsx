import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { genres } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Genre } from '@/types/rekordbox/genre';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Library' },
  {
    title: 'Genres',
    href: genres.index().url,
  },
];

interface Props {
  data: {
    data: Genre[];
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
      <Head title="Genres" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable<Genre>
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
