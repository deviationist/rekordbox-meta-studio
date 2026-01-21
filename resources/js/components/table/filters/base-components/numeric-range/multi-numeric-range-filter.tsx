import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { ButtonLabel } from "../button-label";
import { RangeField, type RangeItemProps } from './range-field';
import { ButtonFooter } from "./button-section";

interface MultiNumericRangeFilterProps {
  label: string;
  fields: RangeItemProps[];
  className?: string;
  icon?: LucideIcon;
}

export function MultiNumericRangeFilter({
  label,
  fields,
  className,
  icon: Icon,
}: MultiNumericRangeFilterProps) {
  // Build the parsers object dynamically
  const parsers = fields.reduce((acc, field) => {
    acc[field.minKey] = parseAsInteger;
    acc[field.maxKey] = parseAsInteger;
    return acc;
  }, {} as Record<string, typeof parseAsInteger>);

  const [queryValues, setQueryValues] = useQueryStates(parsers);

  // Local state for immediate UI updates
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const applyFilters = () => {
    const updates: Record<string, number | null> = {};

    fields.forEach((field) => {
      const localMin = localValues[field.minKey] ?? "";
      const localMax = localValues[field.maxKey] ?? "";

      updates[field.minKey] = localMin === "" ? null : parseInt(localMin);
      updates[field.maxKey] = localMax === "" ? null : parseInt(localMax);
    });

    setQueryValues(updates);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
    setIsOpen(false);
  };

  const handleMinInputChange = (field: RangeItemProps, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field.minKey]: value }));
  };

  const handleMaxInputChange = (field: RangeItemProps, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field.maxKey]: value }));
  };

  const handleInputClear = (field: RangeItemProps) => {
    setLocalValues((prev) => ({ ...prev, [field.minKey]: "" }));
    setLocalValues((prev) => ({ ...prev, [field.maxKey]: "" }));
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sync local state with query state when opening
      const newLocalValues: Record<string, string> = {};
      fields.forEach((field) => {
        newLocalValues[field.minKey] = queryValues[field.minKey]?.toString() ?? "";
        newLocalValues[field.maxKey] = queryValues[field.maxKey]?.toString() ?? "";
      });
      setLocalValues(newLocalValues);
    } else {
      // Apply filters when dropdown closes
      applyFilters();
    }
    setIsOpen(open);
  };

  const handleClearAllFields = () => {
    const clearedValues: Record<string, string> = {};
    const updates: Record<string, null> = {};

    fields.forEach((field) => {
      clearedValues[field.minKey] = "";
      clearedValues[field.maxKey] = "";
      updates[field.minKey] = null;
      updates[field.maxKey] = null;
    });

    setLocalValues(clearedValues);
    setQueryValues(updates);
  };

  const activeFiltersCount = useMemo(() => {
    return fields.reduce((count, field) => {
      return count +
        ((queryValues[field.minKey] != null || queryValues[field.maxKey] != null) ? 1 : 0);
    }, 0);
  }, [fields, queryValues]);

  const hasActiveFilter = activeFiltersCount > 0;
  const rangeText = useMemo<string | undefined>(() => hasActiveFilter ? `${activeFiltersCount}` : undefined, [hasActiveFilter, activeFiltersCount]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <ButtonLabel
        className={className}
        buttonIcon={Icon}
        label={label}
        pillContent={rangeText}
        hasActiveFilter={hasActiveFilter}
        handleClearAll={handleClearAllFields}
      />

      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-1 gap-3">
          {fields.map((field, index) => {
            const minValue = localValues[field.minKey] ?? "";
            const maxValue = localValues[field.maxKey] ?? "";

            return <RangeField
              key={index}
              {...field}
              shouldDisplayClearButton={true}
              minValue={minValue}
              maxValue={maxValue}
              clearField={() => handleInputClear(field)}
              handleMinInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMinInputChange(field, e.target.value)}
              handleMaxInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMaxInputChange(field, e.target.value)}
            />

            /*
            return (
              <div key={field.minKey} className="flex flex-col gap-1.5">
                <div className="flex flex-row items-center">
                  <label className="text-sm flex-1 font-medium text-muted-foreground">
                    {field.label}
                  </label>
                  {(minValue || maxValue) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer h-auto"
                      onClick={() => {
                        handleInputClear(field.minKey);
                        handleInputClear(field.maxKey);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex items-center">
                  <Input
                    id={`${field.minKey}-input`}
                    type="number"
                    value={minValue}
                    onChange={(e) => handleInputChange(field.minKey, e.target.value)}
                    placeholder={field.placeholder?.min ?? "Min"}
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    className="h-9 px-2 flex-1 rounded-r-none border-r-0"
                  />
                  <div className="w-px h-9 border-r border-input" />
                  <Input
                    id={`${field.maxKey}-input`}
                    type="number"
                    value={maxValue}
                    onChange={(e) => handleInputChange(field.maxKey, e.target.value)}
                    placeholder={field.placeholder?.max ?? "Max"}
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    className={cn(
                      "h-9 px-2 flex-1",
                      field.suffix ? "rounded-none border-l-0" : "rounded-l-none",
                    )}
                  />
                  {field.suffix && (
                    <div className="border-input border flex items-center border-l-0 justify-center h-9 rounded-r-md">
                      <div className="w-9.5 text-muted-foreground text-xs text-center">
                        {field.suffix}
                      </div>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
              </div>
            );
            */

          })}

          <ButtonFooter hasActiveFilter={hasActiveFilter} handleClear={handleClearAllFields} />

          {/*
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
          */}
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
