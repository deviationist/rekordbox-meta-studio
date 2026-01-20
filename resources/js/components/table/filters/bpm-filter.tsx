import { Gauge } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range-filter";

export function BpmFilter() {
  return (
    <NumericRangeFilter
      minKey="minBpm"
      maxKey="maxBpm"
      label="BPM"
      icon={Gauge}
    />
  );
}
