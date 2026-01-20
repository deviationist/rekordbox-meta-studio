import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputWithCross } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { parseAsFloat, useQueryState } from "nuqs";
import { useState } from "react";

interface NumericRangeFilterProps {
  label: string;
  minKey: string;
  maxKey: string;
  placeholder?: {
    min?: string;
    max?: string;
  };
  step?: number;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function NumericRangeFilter({
  label,
  minKey,
  maxKey,
  placeholder = { min: "Min", max: "Max" },
  step = 1,
  className,
  icon: Icon,
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

  const getButtonLabel = () => {
    if (minValue && maxValue) {
      return `${label}: ${minValue} - ${maxValue}`;
    }
    if (minValue) {
      return `${label}: ${minValue}+`;
    }
    if (maxValue) {
      return `${label}: ≤${maxValue}`;
    }
    return label;
  };

  const hasActiveFilter = !!minValue || !!maxValue;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-0 w-full">
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer flex-1 inline-flex items-center gap-2",
              hasActiveFilter ? "rounded-r-none" : "",
              className,
            )}
            size="sm"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {getButtonLabel()}
          </Button>
          {hasActiveFilter && (
            <Button
              variant="outline"
              size="sm"
              title="Clear all"
              className="cursor-pointer has-[>svg]:px-2 rounded-l-none border-l-0"
              onClick={handleClearAll}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-1 gap-2">
          <div className="flex">
            <InputWithCross
              id={`${minKey}-input`}
              type="number"
              value={localMin}
              onChange={handleMinChange}
              onClear={handleMinClear}
              placeholder={placeholder.min}
              containerClassName="rounded-r-none border-r-0"
              step={step}
              className="h-9"
            />
            <div className="w-px h-9 border-r border-input" />
            <InputWithCross
              id={`${maxKey}-input`}
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              onClear={handleMaxClear}
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
