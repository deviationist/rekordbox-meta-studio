import { Clock } from "lucide-react";
import { DurationRangeFilter } from "./base-components/duration-range-filter";

export function DurationFilter() {
  return (
    <DurationRangeFilter
      minKey="minLength"
      maxKey="maxLength"
      label="Length"
      icon={Clock}
    />
  );
}
