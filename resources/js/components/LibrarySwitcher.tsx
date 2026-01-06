import React from 'react';
import { router } from '@inertiajs/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Library } from '@/types/library';

interface LibrarySwitcherProps {
  libraries: Library[];
  currentLibrary: Library;
}

export function LibrarySwitcher({ libraries, currentLibrary }: LibrarySwitcherProps) {
  // Don't show switcher if only one library
  if (libraries.length <= 1) {
    return null;
  }

  const handleLibraryChange = (slug: string) => {
    const currentPath = window.location.pathname;

    // Replace library slug in URL or add it
    let newPath: string;

    if (currentPath.includes('/library/')) {
      // Replace existing slug
      newPath = currentPath.replace(/\/library\/[^\/]+/, `/library/${slug}`);
    } else {
      // Add slug to path
      newPath = currentPath.replace('/library', `/library/${slug}`);
    }

    router.visit(newPath);
  };

  return (
    <Select value={currentLibrary.slug} onValueChange={handleLibraryChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select library" />
      </SelectTrigger>
      <SelectContent>
        {libraries.map((library) => (
          <SelectItem key={library.id} value={library.slug}>
            {library.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
