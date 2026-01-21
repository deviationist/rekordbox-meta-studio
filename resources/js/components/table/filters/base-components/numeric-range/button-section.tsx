import { Button } from "@/components/ui/button";

export type ButtonFooterProps = {
  hasActiveFilter: boolean;
  clearButtonLabel?: string;
  handleClear: () => void;
};

export function ButtonFooter({ hasActiveFilter, clearButtonLabel = 'Clear', handleClear }: ButtonFooterProps) {
  return (
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
          onClick={handleClear}
        >
          {clearButtonLabel}
        </Button>
      )}
    </div>
  );
}
