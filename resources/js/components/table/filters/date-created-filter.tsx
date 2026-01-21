import { Calendar } from "lucide-react";
import { DateFilter } from "./base-components/date-filter";

export function DateCreatedFilter() {
  return (
    <DateFilter
      fromKey="minDateCreated"
      toKey="maxDateCreated"
      label="Date Created"
      icon={Calendar}
    />
  );
}
