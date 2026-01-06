import { useLibraryStore } from "@/store/library";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { route } from "ziggy-js";

const syncLibraryOnSwitch = (store: [string | undefined, (value: string | undefined) => void, () => void], fallbackValue: string): void => {
  const [library, setLibrary] = store;
  if (library && fallbackValue && fallbackValue !== library) {
    setLibrary(fallbackValue);
  }
};

export function useLibrary() {
  const page = usePage<SharedData>();
  const { defaultLibrary } = page.props;
  const currentRoute = route();
  const libraryFromRoute = currentRoute.params?.library;
  const store = useLibraryStore<string | undefined>(libraryFromRoute ?? defaultLibrary);
  useEffect(() => syncLibraryOnSwitch(store, libraryFromRoute), []); // Update state if we swtich using the URL
  return store;
}
