import { Ziggy } from '@/ziggy';
import { RouteName, RouteParams, RouteUrl, useRoute as useRouteNative } from 'ziggy-js';
import { useLibrary } from './use-library';

interface ConfigItem {
  routeMatchPattern: string;
  routeReplacement: string;
  matchParam: string;
  paramValue?: string;
}

export function useRoute() {
  const route = useRouteNative();
  const [library] = useLibrary();
  const config: ConfigItem[] = [
    {
      routeMatchPattern: 'library.',
      routeReplacement: 'library.named.',
      matchParam: 'library',
      paramValue: library,
    }
  ];

  const maybeAddParams = <T extends RouteName>(routeName: T, params?: RouteParams<T>): RouteParams<T> | undefined => {
    for (const configItem of config) {
      const routeDefinition = Ziggy.routes[routeName];
      const routeShouldHaveParam = routeDefinition.uri.includes(`{${configItem.matchParam}}`);

      if (configItem.paramValue && routeShouldHaveParam ) {
        params = {
        ...params,
        [configItem.matchParam]: configItem.paramValue,
      } as RouteParams<T>;
      }
    }
    return params;

    /*
    // IF library, library not in params, but params is in route definition

    const routeDefinition = Ziggy.routes[routeName];
    const routeHasLibraryParam = routeDefinition.uri.includes('{library}');

    console.log("library", library);
    console.log("routeName", routeName);
    console.log("routeDefinition", routeDefinition);
    console.log("routeHasLibraryParam", routeHasLibraryParam);

    console.log("params", params);
    console.log("has library in params", params && 'library' in params);
    console.log("-".repeat(100));

    if (library && routeHasLibraryParam && (!params || !('library' in params))) {
      params = {
        ...params,
        library,
      } as RouteParams<T>;
    }
    console.log("params", params);
    return params;
    */
  };

  const maybeReplaceRouteName = <T extends RouteName>(routeName: T): T => {
    for (const configItem of config) {
      if (routeName.includes(configItem.routeMatchPattern)) {
        routeName = routeName.replace(configItem.routeMatchPattern, configItem.routeReplacement) as T;
      }
    }
    return routeName;
  };

  return <T extends RouteName>(routeName: T, params?: RouteParams<T>): RouteUrl => {
    routeName = maybeReplaceRouteName<T>(routeName);
    params = maybeAddParams<T>(routeName, params);
    return route(routeName, params);
  }
}
