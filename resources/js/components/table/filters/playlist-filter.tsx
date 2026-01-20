import { List } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";
import { FilterSelect } from "./base-components/filter-select";

export function PlaylistFilter() {
  const { filterOptions } = usePage<SharedData & { filterOptions: ModelFilterState }>().props;
  return (
    <FilterSelect
      queryParam="playlist"
      label="Playlist"
      icon={List}
      selectableItems={filterOptions.playlists}
    />
  );
}
