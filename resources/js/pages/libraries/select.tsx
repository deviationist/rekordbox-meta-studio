import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';
import LibrarySelector from '@/components/library-selector/library-selector';
import { Library } from '@/types/library';
import { useLibrary } from '@/hooks/use-library';
import { useLibraryStore } from '@/store/library';
import { LibraryRedirect } from '@/components/library-selector/library-redirect';

type PageProps = {
  data: PageData;
}

type PageData = {
  libraries: Library[]
}

export default function Select({ data }: PageProps) {
  const { libraries } = data;
  const route = useRoute();
  const [lastLibraryId] = useLibraryStore();
  const [, setSelectedLibrary] = useLibrary();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    {
      title: 'Library',
    },
    {
      title: 'Select',
    },
  ], []);

  const lastLibrary = useMemo<Library | undefined>(() => libraries.find(library => library.id === lastLibraryId), [libraries, lastLibraryId]);

  const handleSelectLibrary = (library: Library) => {
    setSelectedLibrary(library.id);
    router.visit(
      route('library.redirect-to-default-route', { library: library.id }),
      { preserveState: true }
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Select Library" />
      <div className="container mx-auto px-4 py-8">
        {lastLibrary ? (
          <LibraryRedirect
            libraries={libraries}
            selectedLibrary={lastLibrary}
          />
        ) : (
          <LibrarySelector
            libraries={libraries}
            onSelectLibrary={handleSelectLibrary}
          />
        )}

      </div>
    </AppLayout>
  );
}
