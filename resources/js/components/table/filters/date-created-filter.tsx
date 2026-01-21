import { Calendar } from "lucide-react";
import { DateRangeFilter } from "./base-components/date-range/date-range-filter";

export function DateCreatedFilter() {
  return (
    <DateRangeFilter
      fromKey="minDateCreated"
      toKey="maxDateCreated"
      label="Date Created"
      icon={Calendar}
    />
  );
}
