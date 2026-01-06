import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RouteName, RouteParams, RouteUrl, useRoute as useRouteNative } from 'ziggy-js';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}


export function useRoute() {
  const route = useRouteNative();
  return <T extends RouteName>(routeName: T, params?: RouteParams<T>): RouteUrl => {
    if (params && 'library' in params && params.library) {
      routeName = routeName.replace('library.', 'library.named.') as T;
    }
    return route(routeName, params);
  };
}
