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
import CurrentSkeleton from './skeletons/CurrentSkeleton.tsx';
import DailySkeleton from './skeletons/DailySkeleton.tsx';
import HourlySkeleton from './skeletons/HourlySkeleton.tsx';
import AdditionalInfoSkeleton from './skeletons/AdditionalInfoSkeleton.tsx';
import SidePanel from './components/SidePanel.tsx';

function App() {
  const [coords, setCoords] = useState<Coords>({ lat: 50.46, lon: 30.46 });
  const [location, setLocation] = useState<string>('Tokyo');
  const [mapType, setMapType] = useState<string>('clouds_new');

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
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="flex gap-4">
            <h1 className="text-2xl font-semibold">Location</h1>
            <LocationDropdown location={location} setLocation={setLocation} />
          </div>
          <div className="flex gap-4">
            <h1 className="text-2xl font-semibold">Map type</h1>
            <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
          </div>
        </div>
        <div className="relative">
          <Map mapType={mapType} coords={coordinates} onMapClick={onMapClick} />
          <MapLegend mapType={mapType} />
        </div>
        <Suspense fallback={<CurrentSkeleton />}>
          <CurrentWeather coords={coordinates} />
        </Suspense>
        <CurrentSkeleton />
        <Suspense fallback={<HourlySkeleton />}>
          <HourlyForecast coords={coordinates} />
        </Suspense>
        <Suspense fallback={<DailySkeleton />}>
          <DailyForecast coords={coordinates} />
        </Suspense>
        <Suspense fallback={<AdditionalInfoSkeleton />}>
          <AdditionalInfo coords={coordinates} />
        </Suspense>
      </div>
      <SidePanel coords={coordinates} />
    </>
  );
}

export default App;
