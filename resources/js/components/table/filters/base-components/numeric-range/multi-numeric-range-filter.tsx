import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { ButtonLabel } from "../button-label";
import { NumericRangeField, type NumericRangeItemProps } from './numeric-range-field';
import { ButtonFooter } from "./button-section";

interface MultiNumericRangeFilterProps {
  label: string;
  fields: NumericRangeItemProps[];
  className?: string;
  icon?: LucideIcon;
  inputProps?: React.ButtonHTMLAttributes<HTMLInputElement>;
}

export function MultiNumericRangeFilter({
  label,
  fields,
  className,
  icon: Icon,
  inputProps = {},
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

  const handleMinInputChange = (field: NumericRangeItemProps, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field.minKey]: value }));
  };

  const handleMaxInputChange = (field: NumericRangeItemProps, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field.maxKey]: value }));
  };

  const handleInputClear = (field: NumericRangeItemProps) => {
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
            return <NumericRangeField
              key={index}
              {...field}
              shouldDisplayClearButton={true}
              minValue={minValue}
              maxValue={maxValue}
              clearField={() => handleInputClear(field)}
              handleMinInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMinInputChange(field, e.target.value)}
              handleMaxInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMaxInputChange(field, e.target.value)}
              inputProps={inputProps}
            />
          })}
          <ButtonFooter hasActiveFilter={hasActiveFilter} handleClear={handleClearAllFields} />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
