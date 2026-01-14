import { Table, PaginationMeta } from '@/components/table/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/types/rekordbox/label';
import { Head } from '@inertiajs/react';
import { columnConfig } from './column-config';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

type PageProps = {
  data: PageData;
  filters: Filters;
}

type PageData = {
  data: Label[];
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
      title: 'Labels',
      href: route('library.labels.index'),
    },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Labels" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Table<Label, Filters>
          columns={columnConfig}
          data={items}
          meta={meta}
          endpoint="/labels"
          filters={filters}
          storageKey="labels-table-state"
        />
      </div>
    </AppLayout>
  );
}
