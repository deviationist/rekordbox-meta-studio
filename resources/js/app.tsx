import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { GlobalEvent } from '@inertiajs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { libraryStoreKey } from './store/library';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Intercepts Inertia requests and appends the current library ID from sessionStorage
 */
function appendLibraryToRequests(event: GlobalEvent<'before'>): void {
  const libraryId = sessionStorage.getItem(libraryStoreKey);
  if (!libraryId) return;
  const { visit } = event.detail;
  console.log("libraryId", libraryId);
  visit.headers = {
    ...visit.headers,
    'X-Library-Id': libraryId,
  };
}

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    router.on('before', appendLibraryToRequests);
    const root = createRoot(el);

    root.render(
      <StrictMode>
        <App {...props} />
      </StrictMode>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
