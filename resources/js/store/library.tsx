import useLocalStorage from "@/hooks/use-local-storage";
import useSessionStorage from "@/hooks/use-session-storage";
import { Library, LibraryIndex } from "@/types/library";
import { SetStateAction, useCallback, useMemo } from "react";

export type LibraryStore = readonly [
  Library,
  (value: SetStateAction<Library | LibraryIndex>) => void,
  () => void
]

export const libraryStoreKey = 'selected-library';

export const useLibraryStore = <T extends Library>(defaultValue?: T) => {
  const [sessionValue, setSessionValue, removeSessionValue] = useSessionStorage<T | undefined>(
    libraryStoreKey,
    undefined // No default for session
  );

  const [localValue, setLocalValue, removeLocalValue] = useLocalStorage<T | undefined>(
    libraryStoreKey,
    undefined // No default for local
  );

  // Priority: sessionStorage -> localStorage -> defaultValue
  const storedValue = useMemo(() => {
    return sessionValue ?? localValue ?? defaultValue;
  }, [sessionValue, localValue, defaultValue]) as T;

  // Wrap the setter to update both storages
  const setLibrary = useCallback(
    (value: SetStateAction<T>) => {
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Convert to Library if it's defined
      const converted = newValue !== undefined && newValue !== null
        ? ensureLibrary(newValue as LibraryIndex | Library) as T
        : newValue;

      // Update both storages
      setSessionValue(converted);
      setLocalValue(converted);
    },
    [storedValue, setSessionValue, setLocalValue]
  );

  // Wrap the remove to clear both storages
  const removeLibrary = useCallback(() => {
    removeSessionValue();
    removeLocalValue();
  }, [removeSessionValue, removeLocalValue]);

  return [storedValue, setLibrary, removeLibrary] as const;
};

function ensureLibrary({ id, name, supports }: LibraryIndex | Library): Library {
  return { id, name, supports };
}
