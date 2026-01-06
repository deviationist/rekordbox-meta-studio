import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { resolveUrl } from '@/lib/utils';
import { type MainNavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { NavItemInner } from './nav-item-inner';

type NavItemProps = {
  item: MainNavItem;
};

export function NavItem({ item }: NavItemProps) {
  const { url } = usePage<SharedData>();

  const isActive = (item: MainNavItem) => {
    if (item.isActive !== undefined) return item.isActive;
    return !!item.href && url.startsWith(resolveUrl(item.href));
  };

  const hasActiveChild = (item: MainNavItem) => {
    if (!item.items) return false;
    return item.items.some(child => isActive(child));
  };

  const hasChildren = item.items && item.items.length > 0;
  const itemActive = hasChildren
      ? hasActiveChild(item)
      : isActive(item);

  const [isOpen, setIsOpen] = useState<boolean>(itemActive);

  return (
    <SidebarMenuItem>
      <Collapsible
        key={item.title}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        {hasChildren ? (
          <>
            {item.href ? (
              <div className="relative">
                <SidebarMenuButton
                  asChild
                  isActive={itemActive}
                  tooltip={{ children: item.title }}
                >
                  <Link
                    href={item.href}
                    prefetch
                    onClick={(e) => {
                      if (itemActive) e.preventDefault();
                      setIsOpen(!isOpen);
                    }}
                  >
                    <NavItemInner item={item} itemActive={itemActive} />
                  </Link>
                </SidebarMenuButton>
              </div>
            ) : (
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="cursor-pointer"
                  isActive={itemActive}
                  tooltip={{ children: item.title }}
                >
                  <NavItemInner item={item} itemActive={itemActive} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <SidebarMenuSub className="mt-0.5">
                {item?.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActive(subItem)}
                    >
                      <Link href={subItem.href} prefetch>
                        <NavItemInner item={subItem} itemActive={isActive(subItem)} />
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : (
          <SidebarMenuButton
            asChild
            isActive={itemActive}
            tooltip={{ children: item.title }}
          >
            <Link href={item.href} prefetch>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )}
      </Collapsible>
    </SidebarMenuItem>
  );
}
