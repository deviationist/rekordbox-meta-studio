import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
//import { InputWithCross } from "@/components/ui/input";
import { parseAsFloat, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { ButtonLabel } from "../button-label";
import { LucideIcon } from "lucide-react";
import { getMinMaxLabelText } from "../utils";
import { RangeField, RangeItemProps } from "./range-field";
import { ButtonFooter } from "./button-section";

type NumericRangeFilterProps = Omit<RangeItemProps, "label"> & {
  label: string;
  className?: string;
  icon?: LucideIcon;
}

export function NumericRangeFilter({
  label,
  minKey,
  maxKey,
  placeholder = { min: "Min", max: "Max" },
  min,
  max,
  step = 1,
  suffix,
  className,
  icon,
}: NumericRangeFilterProps) {
  const [minValue, setMinValue] = useQueryState(
    minKey,
    parseAsFloat
  );
  const [maxValue, setMaxValue] = useQueryState(
    maxKey,
    parseAsFloat
  );

  // Local state for immediate UI updates
  const [localMin, setLocalMin] = useState<string>("");
  const [localMax, setLocalMax] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    const min = localMin === "" ? null : parseFloat(localMin);
    const max = localMax === "" ? null : parseFloat(localMax);
    setMinValue(min);
    setMaxValue(max);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
    setIsOpen(false);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value);
  };

  const handleMinClear = () => {
    setLocalMin("");
  };

  const handleMaxClear = () => {
    setLocalMax("");
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sync local state with query state when opening
      setLocalMin(minValue?.toString() ?? "");
      setLocalMax(maxValue?.toString() ?? "");
    } else {
      // Apply filters when dropdown closes
      applyFilters();
    }
    setIsOpen(open);
  };

  const handleClearAll = () => {
    setLocalMin("");
    setLocalMax("");
    setMinValue(null);
    setMaxValue(null);
  };

  const hasActiveFilter = !!minValue || !!maxValue;
  const rangeText = useMemo<string | undefined>(
    () => (minValue || maxValue) ? getMinMaxLabelText({ minValue, maxValue, suffix }) : undefined,
    [minValue, maxValue, suffix]
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <ButtonLabel
        className={className}
        buttonIcon={icon}
        label={label}
        pillContent={rangeText}
        hasActiveFilter={hasActiveFilter}
        handleClearAll={handleClearAll}
      />
      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-1 gap-2">
          <RangeField
            {...{ placeholder, min, max, minKey, maxKey, step, suffix }}
            minValue={localMin}
            maxValue={localMax}
            handleMinInputChange={handleMinChange}
            handleMaxInputChange={handleMaxChange}
            clearField={() => {
              handleMinClear();
              handleMaxClear();
            }}
          />
          <ButtonFooter hasActiveFilter={hasActiveFilter} handleClear={handleClearAll} />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
