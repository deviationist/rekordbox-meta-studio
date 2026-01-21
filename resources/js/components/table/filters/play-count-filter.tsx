import { Play } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range/numeric-range-filter";

export function PlayCountFilter() {
  return (
    <NumericRangeFilter
      minKey="minPlayCount"
      maxKey="maxPlayCount"
      label="Play Count"
      icon={Play}
      inputProps={{ min: 0, max: 9999 }}
    />
  );
}
