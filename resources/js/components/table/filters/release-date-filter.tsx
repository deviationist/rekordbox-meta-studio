import { Calendar } from "lucide-react";
import { DateFilter } from "./base-components/date-filter";

export function ReleaseDateFilter() {
  return (
    <DateFilter
      fromKey="minReleaseDate"
      toKey="maxReleaseDate"
      label="Release Date"
      icon={Calendar}
    />
  );
}
