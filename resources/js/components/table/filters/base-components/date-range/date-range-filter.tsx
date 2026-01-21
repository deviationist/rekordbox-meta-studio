import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { ButtonLabel } from "../button-label";
import { LucideIcon } from "lucide-react";
import { getMinMaxLabelText } from "../utils";
import { DateRangeField } from "./date-range-field";
import { format, parse } from "date-fns";

interface DateFilterProps {
  label: string;
  fromKey: string;
  toKey: string;
  className?: string;
  icon?: LucideIcon;
  dateFormat?: string;
  queryParamDateFormat?: string;
}

export function DateRangeFilter({
  label,
  fromKey,
  toKey,
  className,
  icon: Icon,
  dateFormat = 'dd.MM.yy',
  queryParamDateFormat = 'yyyy-MM-dd',
}: DateFilterProps) {
  const [fromValue, setFromValue] = useQueryState(
    fromKey,
    parseAsString
  );
  const [toValue, setToValue] = useQueryState(
    toKey,
    parseAsString
  );

  const handleClearAll = () => {
    setFromValue(null);
    setToValue(null);
    setFromDate(null);
    setToDate(null);
  };

  const [fromDate, setFromDate] = useState<Date | null>(fromValue ? parse(fromValue, queryParamDateFormat, new Date) : null);
  const [toDate, setToDate] = useState<Date | null>(toValue ? parse(toValue, queryParamDateFormat, new Date) : null);

  const fromFormatted = useMemo<string | null>(() => fromDate ? format(fromDate, dateFormat) : null, [fromDate, dateFormat,]);
  const toFormatted = useMemo<string | null>(() => toDate ? format(toDate, dateFormat) : null, [toDate, dateFormat]);

  const hasActiveFilter = !!fromValue || !!toValue;
  const rangeText = useMemo<string | undefined>(() => (fromFormatted || toFormatted) ? getMinMaxLabelText({ minValue: fromFormatted, maxValue: toFormatted }) : undefined, [fromFormatted, toFormatted]);

  useEffect(() => {
    setFromValue(fromDate ? format(fromDate, queryParamDateFormat) : null);
  }, [fromDate, queryParamDateFormat, setFromValue]);

  useEffect(() => {
    setToValue(toDate ? format(toDate, queryParamDateFormat) : null);
  }, [toDate, queryParamDateFormat, setToValue]);

  return (
    <DropdownMenu modal={false}>
      <ButtonLabel
        className={className}
        buttonIcon={Icon}
        label={label}
        pillContent={rangeText}
        hasActiveFilter={hasActiveFilter}
        handleClearAll={handleClearAll}
      />
      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <DateRangeField
          dateFormat={dateFormat}
          fromValue={fromDate}
          toValue={toDate}
          minKey={fromKey}
          maxKey={toKey}
          placeholder={{ min: "From", max: "To" }}
          clearField={handleClearAll}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
