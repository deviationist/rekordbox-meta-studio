import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { InputWithCross } from "@/components/ui/input";
import { DurationParser } from "@/lib/duration-parser";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { ButtonLabel } from "./button-label";
import { LucideIcon } from "lucide-react";
import { getMinMaxLabelText } from "./utils";

interface DateFilterProps {
  label: string;
  fromKey: string;
  toKey: string;
  placeholder?: {
    min?: string;
    max?: string;
  };
  step?: number;
  className?: string;
  icon?: LucideIcon;
}

export function DateFilter({
  label,
  fromKey,
  toKey,
  placeholder = { min: "From", max: "To" },
  step = 1,
  className,
  icon: Icon,
}: DateFilterProps) {
  const [fromValue, setFromValue] = useQueryState(
    fromKey,
    parseAsString
  );
  const [toValue, setToValue] = useQueryState(
    toKey,
    parseAsString
  );

  // Local state for immediate UI updates
  const [localFrom, setLocalFrom] = useState<string>("");
  const [localTo, setLocalTo] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    const min = localFrom === "" ? null : DurationParser.normalizeString(localFrom);
    const max = localTo === "" ? null : DurationParser.normalizeString(localTo);
    setFromValue(min);
    setToValue(max);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
    setIsOpen(false);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFrom(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalTo(e.target.value);

  const handleFromClear = () => setLocalFrom("");
  const handleToClear = () => setLocalTo("");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sync local state with query state when opening
      setLocalFrom(fromValue?.toString() ?? "");
      setLocalTo(toValue?.toString() ?? "");
    } else {
      // Apply filters when dropdown closes
      applyFilters();
    }
    setIsOpen(open);
  };

  const handleClearAll = () => {
    setLocalFrom("");
    setLocalTo("");
    setFromValue(null);
    setToValue(null);
  };

  const hasActiveFilter = !!fromValue || !!toValue;
  const rangeText = useMemo<string | undefined>(() => (fromValue || toValue) ? getMinMaxLabelText({ minValue: fromValue, maxValue: toValue }) : undefined, [fromValue, toValue]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <ButtonLabel
        className={className}
        buttonIcon={Icon}
        label={label}
        pillContent={rangeText}
        hasActiveFilter={hasActiveFilter}
        handleClearAll={handleClearAll}
      />

      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-1 gap-2">
          <div className="flex">
            <InputWithCross
              id={`${fromKey}-input`}
              value={localFrom}
              onChange={handleFromChange}
              onClear={handleFromClear}
              placeholder={placeholder.min}
              containerClassName="rounded-r-none border-r-0"
              step={step}
              className="h-9"
            />
            <div className="w-px h-9 border-r border-input" />
            <InputWithCross
              id={`${toKey}-input`}
              value={localTo}
              onChange={handleToChange}
              onClear={handleToClear}
              placeholder={placeholder.max}
              containerClassName="rounded-l-none border-l-0"
              step={step}
              className="h-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="flex-1 cursor-pointer"
            >
              Apply
            </Button>
            {hasActiveFilter && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={handleClearAll}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
