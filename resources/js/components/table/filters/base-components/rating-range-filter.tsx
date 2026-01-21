import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { ButtonLabel } from "./button-label";
import { getMinMaxLabelText } from "./utils";

interface RatingRangeFilterProps {
  label?: string;
  minKey: string;
  maxKey: string;
  className?: string;
  maxRating?: number;
}

export function RatingRangeFilter({
  label = "Rating",
  minKey,
  maxKey,
  className,
  maxRating = 5,
}: RatingRangeFilterProps) {
  const [minValue, setMinValue] = useQueryState(minKey, parseAsInteger);
  const [maxValue, setMaxValue] = useQueryState(maxKey, parseAsInteger);

  // Local state for immediate UI updates
  const [localMin, setLocalMin] = useState<number | null>(null);
  const [localMax, setLocalMax] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    setMinValue(localMin);
    setMaxValue(localMax);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sync local state with query state when opening
      setLocalMin(minValue ?? null);
      setLocalMax(maxValue ?? null);
    } else {
      // Apply filters when dropdown closes
      applyFilters();
    }
    setIsOpen(open);
  };

  const handleClearAll = () => {
    setLocalMin(null);
    setLocalMax(null);
    setMinValue(null);
    setMaxValue(null);
  };

  const handleRatingClick = (rating: number, type: "min" | "max") => {
    if (type === "min") {
      setLocalMin(localMin === rating ? null : rating);
    } else {
      setLocalMax(localMax === rating ? null : rating);
    }
  };

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  const hasActiveFilter = minValue !== null || maxValue !== null;
  const rangeText = useMemo<string | undefined>(() => (minValue || maxValue) ? getMinMaxLabelText({ minValue, maxValue, delimiter: ' - ' }) : undefined, [minValue, maxValue]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <ButtonLabel
        className={className}
        buttonIcon={Star}
        label={label}
        pillContent={rangeText}
        pillIcon={Star}
        hasActiveFilter={hasActiveFilter}
        handleClearAll={handleClearAll}
      />

      <DropdownMenuContent
        align="start"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <div className="flex flex-col p-3 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">Minimum Rating</div>
            <StarSelector
              selectedRating={localMin}
              onRatingClick={(rating) => handleRatingClick(rating, "min")}
              maxRating={maxRating}
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Maximum Rating</div>
            <StarSelector
              selectedRating={localMax}
              onRatingClick={(rating) => handleRatingClick(rating, "max")}
              maxRating={maxRating}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={handleApply}
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
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface StarSelectorProps {
  selectedRating: number | null;
  onRatingClick: (rating: number) => void;
  maxRating: number;
}

function StarSelector({
  selectedRating,
  onRatingClick,
  maxRating,
}: StarSelectorProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? selectedRating ?? 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onRatingClick(rating === selectedRating ? 0 : rating)}
          onMouseEnter={() => setHoverRating(rating)}
          onMouseLeave={() => setHoverRating(null)}
          className="cursor-pointer transition-colors hover:scale-110"
        >
          <Star
            className={cn(
              "h-5 w-5",
              rating <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
      {selectedRating !== null && selectedRating > 0 && (
        <button
          type="button"
          onClick={() => onRatingClick(0)}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}
