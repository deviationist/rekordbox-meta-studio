import { List } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./model-filter";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";

export function PlaylistFilter() {
  const { filters, filterOptions } = usePage<SharedData & { filters: ModelFilterState, filterOptions: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="playlist"
      label="Playlist"
      icon={List}
      selectableItems={filterOptions.playlist}
      activeItems={filters.playlist || []}
    />
  );
}
