import { FileAudio } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";
import { FilterSelect } from "./base-components/filter-select";

export function FileTypeFilter() {
  const { filterOptions } = usePage<SharedData & { filterOptions: ModelFilterState }>().props;
  return (
    <FilterSelect
      queryParam="fileType"
      label="File Type"
      icon={FileAudio}
      search={false}
      selectableItems={filterOptions.fileTypes}
    />
  );
}
