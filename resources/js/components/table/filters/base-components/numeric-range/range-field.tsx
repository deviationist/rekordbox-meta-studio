import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type RangeItemProps = {
  label?: string;
  minKey: string;
  maxKey: string;
  placeholder?: {
    min?: string;
    max?: string;
  };
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export type RangeFieldProps = RangeItemProps & {
  shouldDisplayClearButton?: boolean;
  minValue: string;
  maxValue: string;
  clearField: () => void;
  handleMinInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RangeField({ shouldDisplayClearButton = false, label, minValue, maxValue, suffix, step, placeholder, min, max, minKey, maxKey, clearField, handleMinInputChange, handleMaxInputChange }: RangeFieldProps) {
  const displayClearButton = useMemo(() => (minValue || maxValue) && shouldDisplayClearButton, [minValue, maxValue, shouldDisplayClearButton]);
  return (
    <div className="flex flex-col gap-1.5">
      {(label || displayClearButton) && (
      <div className="flex flex-row items-center">
        <label className="text-sm flex-1 font-medium text-muted-foreground">
          {label}
        </label>
        {displayClearButton && (
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer h-auto"
            onClick={() => clearField()}
          >
            Clear
          </Button>
        )}
      </div>
      )}
      <div className="flex items-center">
        <Input
          id={`${minKey}-input`}
          type="number"
          value={minValue}
          onChange={(e) => handleMinInputChange(e)}
          placeholder={placeholder?.min ?? "Min"}
          min={min}
          max={max}
          step={step ?? 1}
          className="h-9 px-2 flex-1 rounded-r-none border-r-0"
        />
        <div className="w-px h-9 border-r border-input" />
        <Input
          id={`${maxKey}-input`}
          type="number"
          value={maxValue}
          onChange={(e) => handleMaxInputChange(e)}
          placeholder={placeholder?.max ?? "Max"}
          min={min}
          max={max}
          step={step ?? 1}
          className={cn(
            "h-9 px-2 flex-1 border-l-0 ",
            suffix ? "rounded-none" : "rounded-l-none",
          )}
        />
        {suffix && (
          <div className="border-input border flex items-center border-l-0 justify-center h-9 rounded-r-md">
            <div className="w-9.5 text-muted-foreground text-xs text-center">
              {suffix}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
