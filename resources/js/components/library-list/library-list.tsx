import { Music } from 'lucide-react';
import { LibraryIndex } from '@/types/library';
import { LibraryCard } from './library-card';
import { CreateLibraryButton } from '@/pages/libraries';

interface LibraryListProps {
  libraries: LibraryIndex[];
  onSelectLibrary: (library: LibraryIndex) => void;
}

export default function LibraryList({ libraries, onSelectLibrary }: LibraryListProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libraries.map((library) =>
          <LibraryCard
            key={library.id}
            onSelect={onSelectLibrary}
            library={library}
          />
        )}
      </div>

      {libraries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No libraries found</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Create your first music library to get started.
          </p>
          <CreateLibraryButton />
        </div>
      )}
    </>
  );
}
