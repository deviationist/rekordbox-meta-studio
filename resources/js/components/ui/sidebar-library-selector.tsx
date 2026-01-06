import { Library } from '@/types/library';
import { LibrarySwitcher } from '../library-switcher';

interface Props {
  libraries?: Library[];
}

export function SidebarLibrarySelector({ libraries }: Props) {
  return (
    <div className="px-2 pt-1">
      {libraries && <LibrarySwitcher libraries={libraries} />}
    </div>
  );
}

