import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { getKeyColor } from "@/pages/tracks/helpers";

type ScaleKeyBadgeProps = {
  scaleName: string;
  label: string;
}

export function ScaleKeyBadge({ scaleName, label }: ScaleKeyBadgeProps) {
  const color = getKeyColor(scaleName);
  return (
    <Badge
      variant="outline"
      className={cn(
        'w-12 text-xs overflow-hidden font-mono tracking-tighter',
        color === 'blue' && 'border-blue-500 -my-1 text-blue-700 dark:text-blue-400',
        color === 'purple' && 'border-purple-500 text-purple-700 dark:text-purple-400'
      )}
    >
      {label}
    </Badge>
  );
}
