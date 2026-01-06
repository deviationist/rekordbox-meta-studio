import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export type NavItem = {
  title: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  href: NonNullable<InertiaLinkProps['href']>;
}

export type MainNavItem = Omit<NavItem, 'href'> & {
  key?: string;
} & (
    | {
          items: MainNavItem[];
          href?: NonNullable<InertiaLinkProps['href']>;
      }
    | {
          items?: undefined;
          href: NonNullable<InertiaLinkProps['href']>;
      }
);

export interface EntityCount {
  tracks: number;
  albums: number;
  artists: number;
  genres: number;
  playlists: number;
  labels: number;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    entityCount: EntityCount;
    auth: Auth;
    sidebarOpen: boolean;
    currentLibrary?: Library;
    userLibraries?: Library[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
