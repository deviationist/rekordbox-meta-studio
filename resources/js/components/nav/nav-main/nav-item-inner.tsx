import { EntityCount, SharedData } from '@/types';
import { type MainNavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NavItemInnerProps = {
  itemActive?: boolean;
  item: MainNavItem,
};

export function CountBadge({ item, itemActive = false }: NavItemInnerProps) {
  const { props } = usePage<SharedData>();
  const count = item?.key && props.entityCount ? props.entityCount[item.key as keyof EntityCount] ?? null : null;
  if (count) {
    return (
      <Badge variant={itemActive ?  "default" : "outline"} className="ml-auto px-1.5 text-xs">
        {count}
      </Badge>
    );
  }
  return <></>;
}

export function NavItemInner({ item, itemActive = false }: NavItemInnerProps) {
  const hasChildren = item.items && item.items.length > 0;
  return (
    <>
      {item.icon && <item.icon />}
      <span>{item.title}</span>
      <div className="ml-auto">
        <CountBadge item={item} itemActive={itemActive} />
        {hasChildren && <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
      </div>
    </>
  )
};
