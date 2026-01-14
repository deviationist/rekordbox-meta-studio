import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';
import LibraryList from '@/components/library-list/library-list';
import { Library, LibraryIndex } from '@/types/library';
import { useLibrary } from '@/contexts/library-context';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

type PageProps = {
  data: PageData;
}

type PageData = {
  data: LibraryIndex[]
}

export function CreateLibraryButton() {
  return (
    <Button asChild>
      <Link className="flex cursor-pointer justify-between items-center" href={route('libraries.create')}>
        <Plus className="mr-2 h-4 w-4" />
        Create Library
      </Link>
    </Button>
  )
}

export default function Index({ data }: PageProps) {
  const { data: libraries } = data;
  const route = useRoute();
  const [,setLibrary] = useLibrary();
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [{ title: 'Libraries' }], []);

  const handleSelectLibrary = (library: LibraryIndex | Library) => {
    setLibrary(library);
    router.visit(
      route('library.redirect-to-default-route', { library: library.id }),
      { preserveState: true }
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Select Library" />
      <div className="container mx-auto px-4 py-8">
        {libraries.length > 0 && (
          <div className="mb-8 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Select Music Library</h1>
              <p className="text-muted-foreground mt-2">
                Choose a library to manage your music collection.
              </p>
            </div>
            <CreateLibraryButton />
          </div>
        )}
        <LibraryList
          libraries={libraries}
          onSelectLibrary={handleSelectLibrary}
        />
      </div>
    </AppLayout>
  );
}
