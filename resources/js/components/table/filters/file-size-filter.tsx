import { File } from "lucide-react";
import { NumericRangeFilter } from "./base-components/numeric-range/numeric-range-filter";

export function FileSizeFilter() {
  return (
    <NumericRangeFilter
      minKey="minFileSize"
      maxKey="maxFileSize"
      label="File Size"
      icon={File}
      suffix="MB"
      min={0}
    />
  );
}
