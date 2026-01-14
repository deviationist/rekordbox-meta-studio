import { Link, router } from '@inertiajs/react';
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
import { useCallback } from 'react';
import { useLibrary } from '@/contexts/library-context';

interface LibrarySwitcherProps {
  libraries: Library[];
}

function routeHasParam(currentRoute: string, param: string): boolean {
  const routeDefinition = Ziggy.routes[currentRoute];
  if (!routeDefinition) return false;

  // Normalize param: remove existing {} if present, then add them
  const normalizedParam = param.startsWith('{') && param.endsWith('}')
    ? param
    : `{${param}}`;

  return routeDefinition.uri.includes(normalizedParam);
}

export function LibrarySwitcher({ libraries }: LibrarySwitcherProps) {
  const route = useRoute();
  const currentRoute = route().current();
  const [library, setLibrary] = useLibrary();

  const selectLibrary = useCallback((libraryId: string) => {
    const selectedLibrary = libraries.find((lib) => lib.id === libraryId);
    if (!selectedLibrary) return;
    setLibrary(selectedLibrary);

    // Redirect to library if we're currently on the library index page
    const resolvedRoute = currentRoute === 'libraries.index'
      ? 'library.redirect-to-default-route'
      : currentRoute as RouteName;

    const shouldNavigate = resolvedRoute && routeHasParam(resolvedRoute, 'library');
    if (!shouldNavigate) {
      return; // The current route does not contain library ID, no need to navigate
    }

    // Navigate to new URL with library parameter
    const newRoute = route(resolvedRoute as RouteName, {
      ...route().params, // Existing params
      library: selectedLibrary.id,
    });
    router.visit(newRoute, { preserveState: true });
  }, [currentRoute, libraries, route, setLibrary]);

  if (libraries.length <= 1) {
    return null;
  }

  return (
    <Select
      value={library?.id ?? ''}
      onValueChange={selectLibrary}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select library" />
      </SelectTrigger>
      <SelectContent>
        {libraries.map((lib) => (
          <SelectItem key={lib.id} value={lib.id}>
            {lib.name}
          </SelectItem>
        ))}
        <div className="border-t pt-1 mt-1">
          <Link
            href={route('libraries.index')}
            className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer"
            onSelect={(e: React.SyntheticEvent<HTMLElement, Event>) => e.preventDefault()}
          >
            Manage Libraries
          </Link>
        </div>
      </SelectContent>
    </Select>
  );
}
