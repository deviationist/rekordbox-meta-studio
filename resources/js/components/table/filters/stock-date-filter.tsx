import { Calendar } from "lucide-react";
import { DateRangeFilter } from "./base-components/date-range/date-range-filter";

export function StockDateFilter() {
  return (
    <DateRangeFilter
      fromKey="minStockDate"
      toKey="maxStockDate"
      label="Stock Date"
      icon={Calendar}
    />
  );
}
