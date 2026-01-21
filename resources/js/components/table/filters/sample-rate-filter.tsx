import { AudioLines } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range/numeric-range-filter";

export function SampleRateFilter() {
  return (
    <NumericRangeFilter
      minKey="minSampleRate"
      maxKey="maxSampleRate"
      label="Sample Rate"
      icon={AudioLines}
    />
  );
}
