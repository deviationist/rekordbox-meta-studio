import useSessionStorage from "@/hooks/use-session-storage";

export const libraryStoreKey = 'selected-library';
export const useLibraryStore = <T extends string | undefined = string | undefined>(defaultValue?: T) =>
    useSessionStorage<T | undefined>(libraryStoreKey, defaultValue);
