import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type BooleanFilterProps = {
  queryParam: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
}

export function BooleanFilter({
  queryParam,
  label,
  icon: Icon,
  className
}: BooleanFilterProps) {
  const [booleanValue, setBooleanValue] = useQueryState(
    queryParam,
    parseAsBoolean.withDefault(false)
  );
  return (
    <Button
      variant="outline"
      className={cn(
        "group cursor-pointer flex-1 inline-flex items-center gap-2 min-w-0",
        className,
      )}
      size="sm"
      onClick={() => setBooleanValue(!booleanValue)}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="shrink-0">
        {label}
      </span>
      <Checkbox
        className="ml-auto group-hover:border-accent-foreground"
        checked={booleanValue}
      />
    </Button>
  );
}
