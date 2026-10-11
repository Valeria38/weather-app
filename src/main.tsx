import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ThemeProvider from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';

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

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
