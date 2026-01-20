import { Tag } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { FilterState } from "@/types/table";
import { ModelFilter } from "./base-components/model-filter";

export function GenreFilter() {
  const { filters } = usePage<SharedData & { filters: FilterState }>().props;
  return (
    <ModelFilter
      modelName="genre"
      label="Genre"
      icon={Tag}
      activeItems={filters.genre || []}
    />
  );
}
