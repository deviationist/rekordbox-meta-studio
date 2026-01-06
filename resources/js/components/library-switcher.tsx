import { router } from '@inertiajs/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ziggy } from '@/ziggy';
import { Library } from '@/types/library';
import { RouteName, useRoute } from 'ziggy-js';
import { useLibrary } from '@/hooks/use-library';

interface LibrarySwitcherProps {
  libraries: Library[];
}

export function LibrarySwitcher({ libraries }: LibrarySwitcherProps) {
  const route = useRoute();

  const [currentLibrary, setLibrary] = useLibrary();

  // Don't show switcher if only one library
  if (libraries.length <= 1) {
    return null;
  }

  const handleLibraryChange = (id: string) => {
    const currentRoute = route().current();
    if (!currentRoute) return;

    const library = libraries.find((library) => library.id === id);
    if (!library) return;

    // Get the route URL to check if it includes {library} parameter
    const routeDefinition = Ziggy.routes[currentRoute];
    const hasLibraryParam = routeDefinition.uri.includes('{library}');

    // Update library ID in session storage
    setLibrary(library.id);

    if (!hasLibraryParam) {
      //console.warn('Current route does not accept library parameter');
      return;
    }

    const currentParams = route().params;
    const newRoute = route(currentRoute as RouteName, {
      ...currentParams,
      library: id,
    });

    router.visit(newRoute, { preserveState: true });
  };

  return (
    <Select value={currentLibrary} onValueChange={handleLibraryChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select library" />
      </SelectTrigger>
      <SelectContent>
        {libraries.map((library) => (
          <SelectItem key={library.id} value={library.id}>
            {library.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
