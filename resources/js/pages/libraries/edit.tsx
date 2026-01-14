import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { LibraryForm } from './form';
import { LibraryIndex } from '@/types/library';
import { useRoute } from '@/hooks/use-route';
import { useMemo } from 'react';

export default function Edit({ library }: { library: LibraryIndex }) {
  const route = useRoute();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    {
      title: 'Libraries',
      href: route('libraries.index'),
    },
    { title: 'Edit' },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Library" />
      <div className="container mx-auto px-4 py-12">
        <LibraryForm library={library} />
      </div>
    </AppLayout>
  );
}
