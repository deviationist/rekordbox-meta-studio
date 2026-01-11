//import { EntityCount, SharedData } from '@/types';
import { type MainNavItem } from '@/types';
//import { usePage } from '@inertiajs/react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEntityCount } from '@/hooks/use-entity-count';

type NavItemInnerProps = {
  itemActive?: boolean;
  item: MainNavItem,
};

export function CountBadge({ item, itemActive = false }: NavItemInnerProps) {
  const entityCount = useEntityCount();
  const count = entityCount.get(item?.key)
  if (!count && !entityCount.isLoading) {
    return <></>;
  }
  return (
    <Badge
      variant={itemActive ? "default" : "outline"}
      className="ml-auto px-1.5 text-xs"
    >
      {entityCount.isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        count
      )}
    </Badge>
  );
}

export function NavItemInner({ item, itemActive = false }: NavItemInnerProps) {
  const hasChildren = item.items && item.items.length > 0;
  return (
    <>
      {item.icon && <item.icon />}
      <span>{item.title}</span>
      <div className="ml-auto">
        {item.displayCount && <CountBadge item={item} itemActive={itemActive} />}
        {hasChildren && <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
      </div>
    </>
  )
};
