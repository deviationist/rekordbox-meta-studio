import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { LibraryForm } from './form';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';

export default function Create() {
  const route = useRoute();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    {
      title: 'Libraries',
      href: route('libraries.index'),
    },
    { title: 'Create' },
  ], [route]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Library" />
      <div className="container mx-auto px-4 py-12">
        <LibraryForm />
      </div>
    </AppLayout>
  );
}
