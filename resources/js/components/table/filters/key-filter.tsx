import { Music2 } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { FilterItem, FilterState } from "@/types/table";
import { FilterSelect } from "./base-components/filter-select";
import { ScaleKeyBadge } from "@/components/scale-key-badge";

export function KeyFilter() {
  const { filterOptions } = usePage<SharedData & { filterOptions: FilterState }>().props;
  return (
    <FilterSelect
      queryParam="key"
      label="Key"
      icon={Music2}
      itemComponent={(item: FilterItem) => <ScaleKeyBadge label={item.name} scaleName={item.name} />}
      selectableItems={filterOptions.keys}
    />
  );
}
