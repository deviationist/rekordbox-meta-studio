import { Music2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./model-filter";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";

export function KeyFilter() {
  const { filters, filterOptions } = usePage<SharedData & { filters: ModelFilterState, filterOptions: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="key"
      label="Key"
      icon={Music2}
      selectableItems={filterOptions.key}
      activeItems={filters.key || []}
    />
  );
}
