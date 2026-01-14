
import { createContext, use, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { useLibraryStore } from '@/store/library';
import { SharedData } from '@/types';
import { Library } from '@/types/library';
import { useLibraryUrlSync } from '@/hooks/use-library-url-sync';

type LibraryContextType = readonly [
  Library | undefined,
  (value: Library | undefined) => void,
  () => void
];

export const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const page = usePage<SharedData>();
  const store = useLibraryStore<Library | undefined>(page.props.defaultLibrary);
  useLibraryUrlSync(store);
  return (
    <LibraryContext value={store}>
      {children}
    </LibraryContext>
  );
}

export function useLibrary() {
  const context = use(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
}
