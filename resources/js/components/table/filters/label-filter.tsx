import { Disc3 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";
import { ModelFilter } from "./base-components/model-filter";

export function LabelFilter() {
  const { filters } = usePage<SharedData & { filters: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="label"
      label="Label"
      icon={Disc3}
      activeItems={filters.label || []}
    />
  );
}
