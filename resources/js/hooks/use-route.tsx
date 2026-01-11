import { Ziggy } from '@/ziggy';
import { RouteName, RouteParams, RouteUrl, useRoute as useRouteNative } from 'ziggy-js';
import { useLibrary } from './use-library';

interface ConfigItem {
  matchParam: string;
  paramValue?: string;
}

export function useRoute() {
  const route = useRouteNative();
  const [library] = useLibrary();

  const config: ConfigItem[] = [
    {
      matchParam: 'library',
      paramValue: library,
    }
  ];

  const maybeAddParams = <T extends RouteName>(routeName: T, params?: RouteParams<T>): RouteParams<T> | undefined => {
    for (const configItem of config) {
      const routeDefinition = Ziggy.routes[routeName];
      const routeShouldHaveParam = routeDefinition.uri.includes(`{${configItem.matchParam}}`);
      const alreadyHasRouteParam = params && configItem.matchParam in params;

      if (configItem.paramValue && !alreadyHasRouteParam && routeShouldHaveParam) {
        params = {
        ...params,
        [configItem.matchParam]: configItem.paramValue,
      } as RouteParams<T>;
      }
    }
    return params;
  };

  return <T extends RouteName>(routeName: T, params?: RouteParams<T>): RouteUrl => {
    params = maybeAddParams<T>(routeName, params);
    return route(routeName, params);
  }
}
