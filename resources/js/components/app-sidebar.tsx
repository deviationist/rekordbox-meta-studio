//import { NavFooter } from '@/components/nav/nav-footer';
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
import type { MainNavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AudioWaveform, DiscAlbum, Guitar, LayoutGrid, Tag, Library, List, Disc3 } from 'lucide-react';
import AppLogo from './app-logo';
import { useMemo } from 'react';
import { useRoute } from '@/hooks/use-route';
import { SidebarLibrarySelector } from './ui/sidebar-library-selector';

export function AppSidebar() {
  const route = useRoute();
  const page = usePage<SharedData>();
  const { userLibraries } = page.props;

  const mainNavItems: MainNavItem[] = useMemo(() => [
    {
      title: 'Dashboard',
      href: route('dashboard.index'),
      icon: LayoutGrid,
    },
    {
      title: 'Library',
      href: route('library.tracks.index'),
      icon: Library,
      items: [
        {
          key: 'tracks',
          title: 'Tracks',
          href: route('library.tracks.index'),
          icon: AudioWaveform,
        },
        {
          key: 'playlists',
          title: 'Playlists',
          href: route('library.playlists.index'),
          icon: List,
        },
        {
          key: 'artists',
          title: 'Artists',
          href: route('library.artists.index'),
          icon: Guitar,
        },
        {
          key: 'albums',
          title: 'Albums',
          href: route('library.albums.index'),
          icon: DiscAlbum,
        },
        {
          key: 'genres',
          title: 'Genres',
          href: route('library.genres.index'),
          icon: Tag,
        },
        {
          key: 'labels',
          title: 'Labels',
          href: route('library.labels.index'),
          icon: Disc3,
        },
      ],
    },
  ], [route]);

  //const footerNavItems: NavItem[] = [];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('dashboard.index')} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarLibrarySelector libraries={userLibraries} />
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
