import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { type MainNavItem } from '@/types';
import { NavItem as NavItemComponent } from './nav-item';

type NavMainProps = {
  items: MainNavItem[];
};

export function NavMain({ items = [] }: NavMainProps) {
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, i) => <NavItemComponent key={i} item={item} />)}
      </SidebarMenu>
    </SidebarGroup>
  );
}
