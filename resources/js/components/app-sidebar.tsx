import { NavFooter } from '@/components/nav/nav-footer';
import { NavMain } from '@/components/nav/nav-main';
import { NavUser } from '@/components/nav/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, tracks, albums, genres, artists, playlists, labels } from '@/routes';
import type { MainNavItem, NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AudioWaveform, DiscAlbum, Guitar, LayoutGrid, Tag, Library, List, Disc3 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: MainNavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard.index(),
    icon: LayoutGrid,
  },
  {
    title: 'Library',
    href: tracks.index(),
    icon: Library,
    items: [
      {
        key: 'tracks',
        title: 'Tracks',
        href: tracks.index(),
        icon: AudioWaveform,
      },
      {
        key: 'playlists',
        title: 'Playlists',
        href: playlists.index(),
        icon: List,
      },
      {
        key: 'artists',
        title: 'Artists',
        href: artists.index(),
        icon: Guitar,
      },
      {
        key: 'albums',
        title: 'Albums',
        href: albums.index(),
        icon: DiscAlbum,
      },
      {
        key: 'genres',
        title: 'Genres',
        href: genres.index(),
        icon: Tag,
      },
      {
        key: 'labels',
        title: 'Labels',
        href: labels.index(),
        icon: Disc3,
      },
    ],
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            hehe
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard.index()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
