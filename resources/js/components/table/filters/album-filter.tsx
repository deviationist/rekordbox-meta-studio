import { DiscAlbum } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./model-filter";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";

export function AlbumFilter() {
  const { filters } = usePage<SharedData & { filters: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="album"
      label="Album"
      icon={DiscAlbum}
      activeItems={filters.album || []}
    />
  );
}
