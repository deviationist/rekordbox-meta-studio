import { User } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./base-components/model-filter";
import { SharedData } from '@/types';
import { FilterState } from "@/types/table";

export function ArtistFilter() {
  const { filters } = usePage<SharedData & { filters: FilterState }>().props;
  return (
    <ModelFilter
      modelName="artist"
      label="Artist"
      icon={User}
      activeItems={filters.artist || []}
    />
  );
}
