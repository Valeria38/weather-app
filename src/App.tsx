import DailyForecast from './components/cards/DailyForecast';
import HourlyForecast from './components/cards/HourlyForecast.tsx';
import CurrentWeather from './components/cards/CurrentWeather.tsx';
import AdditionalInfo from './components/cards/AdditionalInfo.tsx';
import Map from './components/Map.tsx';
import { useState } from 'react';
import type { Coords } from '../types.ts';
import LocationDropdown from './components/dropdowns/LocationDropdown.tsx';
import { getGeocode } from './api.ts';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import MapTypeDropdown from './components/dropdowns/MapTypeDropdown.tsx';

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
      <Map mapType={mapType} coords={coordinates} onMapClick={onMapClick} />
      <CurrentWeather coords={coordinates} />
      <HourlyForecast coords={coordinates} />
      <DailyForecast coords={coordinates} />
      <AdditionalInfo coords={coordinates} />
    </div>
  );
}

export default App;
