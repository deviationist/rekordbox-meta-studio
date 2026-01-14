import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ComponentType, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppearanceSync, initializeTheme } from './hooks/use-appearance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { LibraryProvider } from './contexts/library-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type PageModule = {
  default: ComponentType & {
    layout?: (page: ReactNode) => ReactNode;
  };
};

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    ).then((module) => {
      const page = module as PageModule;
      if (!name.startsWith('auth/')) {
        page.default.layout = (children: ReactNode) => (
          <LibraryProvider>{children}</LibraryProvider>
        );
      }
      return page;
    }),

  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <StrictMode>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <AppearanceSync />
            <App {...props} />
          </QueryClientProvider>
        </NuqsAdapter>
      </StrictMode>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
