import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LucideIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ButtonLabelProps = {
  className?: string;
  buttonIcon?: LucideIcon;
  label: string;
  pillContent?: React.ReactNode;
  pillIcon?: LucideIcon;
  hasActiveFilter: boolean;
  handleClearAll: () => void;
};

export function ButtonLabel({
  className,
  buttonIcon: ButtonIcon,
  label,
  pillContent,
  pillIcon: PillIcon,
  hasActiveFilter,
  handleClearAll
}: ButtonLabelProps) {
  const pillContentString = typeof pillContent === 'string'
    ? pillContent
    : String(pillContent);

  return (
    <DropdownMenuTrigger asChild>
      <div className="flex items-center min-w-0">
        <Button
          variant="outline"
          className={cn(
            "group cursor-pointer flex-1 inline-flex items-center justify-start gap-2 min-w-0",
            pillContent ? "gap-1.5 !px-2" : "",
            hasActiveFilter ? "rounded-r-none" : "",
            className,
          )}
          size="sm"
        >
          {ButtonIcon && <ButtonIcon className="h-4 w-4 shrink-0" />}
          <span className="shrink-0">
            {label}
          </span>

          {pillContent && (
            <div className="min-w-0 max-w-full inline-flex">
              <Badge
                variant="secondary"
                title={pillContentString}
                className="text-[10px] px-1.5 py-0.5 gap-1 min-w-0 max-w-full whitespace-normal group-hover:border-accent-foreground"
              >
                {PillIcon && <PillIcon className="!h-2 !w-2 shrink-0 fill-current" />}
                <span className="truncate hyphens-auto" lang="en">
                  {pillContent}
                </span>
              </Badge>
            </div>
          )}
        </Button>
        {hasActiveFilter && (
          <Button
            variant="outline"
            size="sm"
            title="Clear all"
            className="cursor-pointer px-2 rounded-l-none border-l-0 shrink-0"
            onClick={handleClearAll}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </DropdownMenuTrigger>
  );
}
