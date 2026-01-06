import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { LibraryForm } from './form';
import { Library } from '@/types/library';
import { useRoute } from '@/hooks/use-route';
import { useMemo } from 'react';

export default function Edit({ library }: { library: Library }) {
  const route = useRoute();
  const { id } = library;
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    {
      title: 'Libraries',
      href: route('libraries.index'),
    },
    {
      title: library.name,
      href: route('libraries.edit', { library: id }),
    },
  ], [route, library, id]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Library" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <LibraryForm library={library} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
