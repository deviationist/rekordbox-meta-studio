import { Image } from "lucide-react";
import { BooleanFilter } from "./base-components/boolean-filter";

export function ArtworkFilter() {
  return (
    <BooleanFilter
      queryParam="hasArtwork"
      label="Has Artwork?"
      icon={Image}
    />
  );
}
