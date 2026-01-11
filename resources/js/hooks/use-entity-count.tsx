import { SharedData, EntityCount } from "@/types";
import { usePage } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLibrary } from "./use-library";
import { useRoute } from "./use-route";

export function useEntityCount() {
  const route = useRoute();
  const { props } = usePage<SharedData>();
  const [library] = useLibrary();

  const { data: fetchedEntityCount, isLoading } = useQuery({
    queryKey: ['entity-count', library],
    queryFn: async () => {
      const { data } = await axios.get<{ entityCount: EntityCount }>(
        route('library.entity-count')
      );
      return data.entityCount;
    },
    enabled: !props.entityCount && !!library,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const get = (key?: string): number | null => {
    if (!key) return null;
    const entityCount = props.entityCount ?? fetchedEntityCount;
    if (!entityCount) return null;
    return entityCount[key as keyof EntityCount] ?? null;
  };

  return { get, isLoading };
}
