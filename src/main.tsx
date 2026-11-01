import './index.css';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ThemeProvider from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import {
  PERSISTED_QUERY_MAX_AGE,
  shouldPersistWeatherQuery,
} from '@/lib/queryPersistence';
import { shouldRetryQuery } from '@/lib/queryRetry';

import App from './App.tsx';

interface LIconDefaultWithGetIconUrl extends L.Icon.Default {
  _getIconUrl?: unknown;
}
delete (L.Icon.Default.prototype as LIconDefaultWithGetIconUrl)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      gcTime: PERSISTED_QUERY_MAX_AGE,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => window.localStorage.getItem(key),
    setItem: async (key, value) => window.localStorage.setItem(key, value),
    removeItem: async (key) => window.localStorage.removeItem(key),
  },
  key: 'weather-app:query-cache',
  throttleTime: 0,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: PERSISTED_QUERY_MAX_AGE,
        buster: 'weather-cache-v1',
        dehydrateOptions: {
          shouldDehydrateQuery: shouldPersistWeatherQuery,
        },
      }}
    >
      <TooltipProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </TooltipProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
