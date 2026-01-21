import { ClockArrowUp } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range/numeric-range-filter";

export function ReleaseYearFilter() {
  return (
    <NumericRangeFilter
      minKey="minReleaseYear"
      maxKey="maxReleaseYear"
      label="Release Year"
      placeholder={{ min: "From", max: "To" }}
      min={0}
      max={9999}
      icon={ClockArrowUp}
    />
  );
}
