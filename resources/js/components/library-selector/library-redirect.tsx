import { Library } from '@/types/library';
import { LibraryCard, LibraryCardSkeleton } from './library-card';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useRoute } from '@/hooks/use-route';

type Props = {
  libraries: Library[];
  selectedLibrary: Library;
}

export function LibraryRedirect({ libraries, selectedLibrary }: Props) {
  const route = useRoute();
  useEffect(() => {
    if (selectedLibrary) {
      router.visit(route('library.redirect-to-default-route', { library: selectedLibrary.id }), { preserveState: true });
    }
  }, [selectedLibrary, route]);
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Loading Library</h1>
        <p className="text-muted-foreground mt-2">
          Please wait while we load your music collection.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libraries.map((library) =>
          selectedLibrary?.id === library.id
            ? <LibraryCard key={library.id} isSelectable={false} isOpening={true} library={library} />
            : <LibraryCardSkeleton />
        )}
      </div>

    </>
  );
}
