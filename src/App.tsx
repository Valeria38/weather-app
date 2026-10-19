import { useQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import type { Coords } from 'types';

import { getGeocode } from '@/api.ts';
import Burger from '@/assets/burger.svg?react';
import AdditionalInfo from '@/components/cards/AdditionalInfo';
import CurrentWeather from '@/components/cards/CurrentWeather';
import DailyForecast from '@/components/cards/DailyForecast';
import HourlyForecast from '@/components/cards/HourlyForecast';
import LocationDropdown from '@/components/dropdowns/LocationDropdown';
import MapTypeDropdown from '@/components/dropdowns/MapTypeDropdown';
import MapLegend from '@/components/MapLegend';
import MapView from '@/components/MapView';
import MobileHeader from '@/components/MobileHeader';
import SidePanel from '@/components/SidePanel';
import AdditionalInfoSkeleton from '@/components/skeletons/AdditionalInfoSkeleton.tsx';
import CurrentSkeleton from '@/components/skeletons/CurrentSkeleton.tsx';
import DailySkeleton from '@/components/skeletons/DailySkeleton.tsx';
import HourlySkeleton from '@/components/skeletons/HourlySkeleton.tsx';
import ThemeToggle from '@/components/ThemeToggle';

const DEFAULT_LOCATION = 'Canton, OH, US';
const DEFAULT_COORDS: Coords = { lat: 40.7989, lon: -81.3784 };

function App() {
  const [coords, setCoords] = useState<Coords>(DEFAULT_COORDS);
  const [location, setLocation] = useState<string>(DEFAULT_LOCATION);
  const [mapType, setMapType] = useState<string>('clouds_new');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const {
    data: geocodeData,
    isPending: isGeocodePending,
    isError: isGeocodeError,
    refetch: retryGeocode,
  } = useQuery({
    queryKey: ['geocode', location],
    queryFn: () => getGeocode(location),
    enabled: location !== 'custom' && location !== DEFAULT_LOCATION,
  });

  const onMapClick = (lat: number, lon: number) => {
    setCoords({ lat, lon });
    setLocation('custom');
  };

  const geocodedLocation = geocodeData?.[0];
  const geocodedLocationJsx = geocodedLocation
    ? { lat: geocodedLocation.lat, lon: geocodedLocation.lon }
    : undefined;
  const usesCurrentCoords =
    location === 'custom' || location === DEFAULT_LOCATION;
  const coordinates: Coords | undefined = usesCurrentCoords
    ? coords
    : geocodedLocationJsx;

  const geocodeErrorJsx = isGeocodeError ? (
    <>
      <p>Could not load this location. Check your connection.</p>
      <button
        className="rounded-md border px-4 py-2"
        onClick={() => void retryGeocode()}
        type="button"
      >
        Retry location lookup
      </button>
    </>
  ) : (
    <p>No matching location was found.</p>
  );

  return (
    <>
      <MobileHeader setIsSidePanelOpen={setIsSidePanelOpen} />
      <div className="flex flex-col gap-8 p-8 pt-4 xs:pt-8 w-full lg:w-[calc(100dvw-var(--sidebar-width))] 2xl:h-screen 2xl:min-h-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row xs:gap-4 justify-between">
          <div className="flex gap-2 md:gap-4 flex-col md:flex-row md:items-center">
            <h1 className="text-lg font-semibold">Location</h1>
            <LocationDropdown location={location} setLocation={setLocation} />
          </div>
          <div className="flex gap-2 md:gap-4 flex-col md:flex-row md:items-center">
            <h1 className="text-lg font-semibold whitespace-nowrap">
              Map type
            </h1>
            <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
          </div>
          <div className="ml-auto items-center gap-4 hidden sm:flex">
            <ThemeToggle />
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="hidden xs:block"
              aria-label="Open sidepanel"
              aria-expanded={isSidePanelOpen}
            >
              <Burger className="size-8  cursor-pointer ml-auto lg:hidden" />
            </button>
          </div>
        </div>
        {coordinates ? (
          <div className="grid grid-cols-1 2xl:flex-1 2xl:min-h-0 gap-4 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4">
            <div className="relative h-120 2xl:h-auto col-span-1 md:col-span-2 2xl:col-span-4 2xl:row-span-2 order-1">
              <MapView
                mapType={mapType}
                coords={coordinates}
                onMapClick={onMapClick}
              />
              <MapLegend mapType={mapType} />
            </div>
            <div className="col-span-1 2xl:row-span-2 order-2">
              <Suspense fallback={<CurrentSkeleton />}>
                <CurrentWeather coords={coordinates} />
              </Suspense>
            </div>
            <div className="col-span-1 order-3 2xl:order-4 2xl:row-span-2">
              <Suspense fallback={<DailySkeleton />}>
                <DailyForecast coords={coordinates} />
              </Suspense>
            </div>
            <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-4 2xl:order-3">
              <Suspense fallback={<HourlySkeleton />}>
                <HourlyForecast coords={coordinates} />
              </Suspense>
            </div>
            <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-5">
              <Suspense fallback={<AdditionalInfoSkeleton />}>
                <AdditionalInfo coords={coordinates} />
              </Suspense>
            </div>
          </div>
        ) : (
          <section
            className="flex min-h-120 flex-col items-center justify-center gap-4 rounded-md bg-card p-6 text-center"
            role={isGeocodeError ? 'alert' : 'status'}
          >
            {isGeocodePending ? <p>Loading location...</p> : geocodeErrorJsx}
          </section>
        )}
      </div>
      {coordinates && (
        <SidePanel
          coords={coordinates}
          isSidePanelOpen={isSidePanelOpen}
          setIsSidePanelOpen={setIsSidePanelOpen}
        />
      )}
    </>
  );
}

export default App;
