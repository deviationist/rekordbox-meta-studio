import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { genres } from '@/routes';
import { LibraryForm } from './form';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Library' },
  {
    title: 'Genres',
    href: genres.index().url,
  },
];

export default function Create() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Library" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <LibraryForm />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
