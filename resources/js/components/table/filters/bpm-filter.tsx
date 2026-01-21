import { Gauge } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range/numeric-range-filter";

export function BpmFilter() {
  return (
    <NumericRangeFilter
      minKey="minBpm"
      maxKey="maxBpm"
      label="BPM"
      icon={Gauge}
      min={0}
      max={9999}
    />
  );
}
