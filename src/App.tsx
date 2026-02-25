import DailyForecast from './components/cards/DailyForecast';
import HourlyForecast from './components/cards/HourlyForecast.tsx';
import CurrentWeather from './components/cards/CurrentWeather.tsx';
import AdditionalInfo from './components/cards/AdditionalInfo.tsx';
import Map from './components/Map.tsx';
import { Suspense, useState } from 'react';
import type { Coords } from '../types.ts';
import LocationDropdown from './components/dropdowns/LocationDropdown.tsx';
import { getGeocode } from './api.ts';
import { useQuery } from '@tanstack/react-query';
import MapTypeDropdown from './components/dropdowns/MapTypeDropdown.tsx';
import MapLegend from './components/MapLegend.tsx';
import CurrentSkeleton from './components/skeletons/CurrentSkeleton.tsx';
import DailySkeleton from './components/skeletons/DailySkeleton.tsx';
import HourlySkeleton from './components/skeletons/HourlySkeleton.tsx';
import AdditionalInfoSkeleton from './components/skeletons/AdditionalInfoSkeleton.tsx';
import SidePanel from './components/SidePanel.tsx';
import Burger from './assets/burger.svg?react';
import MobileHeader from './components/MobileHeader.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';

function App() {
  const [coords, setCoords] = useState<Coords>({ lat: 50.46, lon: 30.46 });
  const [location, setLocation] = useState<string>('Tokyo');
  const [mapType, setMapType] = useState<string>('clouds_new');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const { data: geocodeData } = useQuery({
    queryKey: ['geocode', location],
    queryFn: () => getGeocode(location),
  });

  const onMapClick = (lat: number, lon: number) => {
    setCoords({ lat, lon });
    setLocation('custom');
  };

  const coordinates =
    location === 'custom'
      ? coords
      : { lat: geocodeData?.[0].lat ?? 0, lon: geocodeData?.[0].lon ?? 0 };

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
            >
              <Burger className="size-8  cursor-pointer ml-auto lg:hidden" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 2xl:flex-1 2xl:min-h-0 gap-4 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4">
          <div className="relative h-120 2xl:h-auto col-span-1 md:col-span-2 2xl:col-span-4 2xl:row-span-2 order-1">
            <Map
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
      </div>
      <SidePanel
        coords={coordinates}
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
      />
    </>
  );
}

export default App;
