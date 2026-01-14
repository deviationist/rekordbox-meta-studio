import { useCallback, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import { SharedData } from "@/types";
import { LibraryStore } from "@/store/library";

export function useLibraryUrlSync(libraryStore: LibraryStore) {
  const [library, setLibrary] = libraryStore;
  const page = usePage<SharedData>();

  const handleNavigate = useCallback(() => {
    const currentRoute = route();
    const routeName = currentRoute.current();

    if (!routeName) return;

    // Check if route definition includes {library} parameter
    const routeDefinition = Ziggy.routes[routeName];
    if (!routeDefinition || !routeDefinition.uri.includes('{library}')) {
      return;
    }

    // Get library ID from URL
    const libraryIdFromUrl = currentRoute.params?.library;
    if (!libraryIdFromUrl) return;

    // Compare with sessionStorage
    if (library?.id !== libraryIdFromUrl) {
      const libraryFromUrl = page.props.userLibraries?.find(
        lib => lib.id === libraryIdFromUrl
      );

      if (libraryFromUrl) {
        setLibrary(libraryFromUrl);
      }
    }
  }, [library?.id, setLibrary, page.props.userLibraries]);

  useEffect(() => {
    // Register event listener
    const unsubscribe = router.on('navigate', handleNavigate);

    // Run once on mount to sync initial state
    handleNavigate();

    return unsubscribe;
  }, []);
}
