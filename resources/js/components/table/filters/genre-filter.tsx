import { Tag } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./model-filter";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";

export function GenreFilter() {
  const { filters } = usePage<SharedData & { filters: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="genre"
      label="Genre"
      icon={Tag}
      activeItems={filters.genre || []}
    />
  );
}
