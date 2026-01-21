import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export type DateRangeItemProps = {
  label?: string;
  minKey: string;
  maxKey: string;
  placeholder?: {
    min?: string;
    max?: string;
  };
  suffix?: string;
}

export type DateRangeFieldProps = DateRangeItemProps & {
  shouldDisplayClearButton?: boolean;
  fromValue: Date | null;
  toValue: Date | null;
  clearField?: () => void;
  onFromChange?: (date: Date | null) => void;
  onToChange?: (date: Date | null) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  dateFormat?: string;
};

export function DateRangeField({
  label,
  fromValue,
  toValue,
  placeholder,
  suffix,
  shouldDisplayClearButton = false,
  minKey,
  maxKey,
  inputProps = {},
  dateFormat = 'dd-MM-yyyy',
  clearField,
  onFromChange,
  onToChange
}: DateRangeFieldProps) {
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const displayClearButton = useMemo(
    () => (fromValue || toValue) && shouldDisplayClearButton,
    [fromValue, toValue, shouldDisplayClearButton]
  );

  const formatDateValue = (date: Date | null) => {
    if (!date) return "";
    try {
      return format(date, dateFormat);
    } catch {
      return "";
    }
  };

  const handleFromSelect = (date: Date | undefined) => {
    onFromChange?.(date || null);
    setIsFromOpen(false);
  };

  const handleToSelect = (date: Date | undefined) => {
    onToChange?.(date || null);
    setIsToOpen(false);
  };

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
        <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
          <PopoverTrigger asChild>
            <Input
              id={`${minKey}-input`}
              type="text"
              value={formatDateValue(fromValue)}
              placeholder={placeholder?.min ?? "From"}
              className="h-9 px-2 flex-1 rounded-r-none border-r-0"
              readOnly
              {...inputProps}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromValue || undefined}
              onSelect={handleFromSelect}
              defaultMonth={fromValue || toValue || undefined}
              disabled={date => !!toValue && date > toValue}
            />
          </PopoverContent>
        </Popover>

        <div className="w-px h-9 border-r border-input" />

        <Popover open={isToOpen} onOpenChange={setIsToOpen}>
          <PopoverTrigger asChild>
            <Input
              id={`${maxKey}-input`}
              type="text"
              value={formatDateValue(toValue)}
              placeholder={placeholder?.max ?? "To"}
              className={cn(
                "h-9 px-2 flex-1 border-l-0",
                suffix ? "rounded-none" : "rounded-l-none",
              )}
              readOnly
              {...inputProps}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toValue || undefined}
              onSelect={handleToSelect}
              defaultMonth={toValue || fromValue || undefined}
              disabled={date => !!fromValue && date < fromValue}
            />
          </PopoverContent>
        </Popover>

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
