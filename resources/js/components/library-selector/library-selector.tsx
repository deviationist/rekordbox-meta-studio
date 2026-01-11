import { Music } from 'lucide-react';
import { Library } from '@/types/library';
import { LibraryCard } from './library-card';

interface LibrarySelectorProps {
  libraries: Library[];
  onSelectLibrary: (library: Library) => void;
}

export default function LibrarySelector({ libraries, onSelectLibrary }: LibrarySelectorProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Select Music Library</h1>
        <p className="text-muted-foreground mt-2">
          Choose a library to manage your music collection.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libraries.map((library) => <LibraryCard key={library.id} onSelect={onSelectLibrary} library={library} />)}
      </div>

      {libraries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No libraries found</h3>
          <p className="text-muted-foreground max-w-sm">
            Create your first music library to get started
          </p>
        </div>
      )}
    </>
  );
}
