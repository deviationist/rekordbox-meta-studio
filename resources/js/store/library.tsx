import useSessionStorage from "@/hooks/use-session-storage";
import { Library, LibraryIndex } from "@/types/library";
import { SetStateAction, useCallback } from "react";

export type LibraryStore = readonly [
  Library | undefined,
  (value: SetStateAction<Library | LibraryIndex | undefined>) => void,
  () => void
]

export const libraryStoreKey = 'selected-library';
export const useLibraryStore = <T extends Library | undefined>(defaultValue?: T) => {
  const [storedValue, setStoredValue, removeValue] = useSessionStorage<T | undefined>(
    libraryStoreKey,
    defaultValue
  );

  // Wrap the setter to ensure Library type
  const setLibrary = useCallback(
    (value: SetStateAction<T | undefined>) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;

        // Convert to Library if it's defined
        if (newValue !== undefined && newValue !== null) {
          return ensureLibrary(newValue as LibraryIndex | Library) as T;
        }

        return newValue;
      });
    },
    [setStoredValue]
  );

  return [storedValue, setLibrary, removeValue] as const;
};

function ensureLibrary({ id, name, supports }: LibraryIndex | Library): Library {
  return { id, name, supports };
}
