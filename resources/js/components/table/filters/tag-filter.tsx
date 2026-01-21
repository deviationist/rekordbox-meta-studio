import { Tag } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { FilterState } from "@/types/table";
import { FilterSelect } from "./base-components/filter-select";

export function TagFilter() {
  const { filterOptions } = usePage<SharedData & { filterOptions: FilterState }>().props;
  return (
    <FilterSelect
      queryParam="tag"
      label="Tag"
      icon={Tag}
      selectableItems={filterOptions.tags}
    />
  );
}
