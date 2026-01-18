import { User } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ModelFilter } from "./model-filter";
import { SharedData } from '@/types';
import { ModelFilterState } from "@/types/table";

export function AlbumArtistFilter() {
  const { filters } = usePage<SharedData & { filters: ModelFilterState }>().props;
  return (
    <ModelFilter
      modelName="artist"
      queryParam="albumArtist"
      label="Album Artist"
      icon={User}
      activeItems={filters.albumArtist || []}
    />
  );
}
