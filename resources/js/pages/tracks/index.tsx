import { DataTable } from '@/components/table/data-table';
import AppLayout from '@/layouts/app-layout';
import { tracks } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { Track } from '@/types/rekordbox/track';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Library' },
  {
    title: 'Tracks',
    href: tracks.index().url,
  },
];

interface Props {
  data: {
    data: Track[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
  filters: {
    search?: string;
    genre?: string;
    min_bpm?: number;
    max_bpm?: number;
    key?: string;
    min_rating?: number;
  };
}

export default function Index({ data, filters }: Props) {
  const { meta, data: items } = data;
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tracks" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <DataTable<Track>
          columns={columnConfig}
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
