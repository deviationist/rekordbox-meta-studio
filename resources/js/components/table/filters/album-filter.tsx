import { DiscAlbum } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./base-components/model-filter";
import { SharedData } from '@/types';
import { FilterState } from "@/types/table";

export function AlbumFilter() {
  const { filters } = usePage<SharedData & { filters: FilterState }>().props;
  return (
    <ModelFilter
      modelName="album"
      label="Album"
      icon={DiscAlbum}
      activeItems={filters.album || []}
    />
  );
}
