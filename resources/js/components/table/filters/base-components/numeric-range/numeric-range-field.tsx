import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type NumericRangeItemProps = {
  label?: string;
  minKey: string;
  maxKey: string;
  placeholder?: {
    min?: string;
    max?: string;
  };
  step?: number;
  suffix?: string;
}

export type NumericRangeFieldProps = NumericRangeItemProps & {
  shouldDisplayClearButton?: boolean;
  minValue: string | null;
  maxValue: string | null;
  clearField?: () => void;
  handleMinInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function NumericRangeField({
  label,
  minValue,
  maxValue,
  placeholder,
  suffix,
  step,
  shouldDisplayClearButton = false,
  minKey,
  maxKey,
  inputProps = {},
  clearField,
  handleMinInputChange,
  handleMaxInputChange
}: NumericRangeFieldProps) {
  const displayClearButton = useMemo(() => (minValue || maxValue) && shouldDisplayClearButton, [minValue, maxValue, shouldDisplayClearButton]);
  const { step: stepFromInputProps, ...restInputProps } = inputProps;
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
            onClick={() => clearField?.()}
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
          value={minValue ?? ""}
          onChange={(e) => handleMinInputChange?.(e)}
          placeholder={placeholder?.min ?? "Min"}
          className="h-9 px-2 flex-1 rounded-r-none border-r-0"
          step={step ?? stepFromInputProps}
          {...restInputProps}
        />
        <div className="w-px h-9 border-r border-input" />
        <Input
          id={`${maxKey}-input`}
          type="number"
          value={maxValue ?? ""}
          onChange={(e) => handleMaxInputChange?.(e)}
          placeholder={placeholder?.max ?? "Max"}
          className={cn(
            "h-9 px-2 flex-1 border-l-0 ",
            suffix ? "rounded-none" : "rounded-l-none",
          )}
          step={step ?? stepFromInputProps}
          {...restInputProps}
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
