import DailyForecast from './components/cards/DailyForecast';
import HourlyForecast from './components/cards/HourlyForecast.tsx';
import CurrentWeather from './components/cards/CurrentWeather.tsx';
import AdditionalInfo from './components/cards/AdditionalInfo.tsx';
import Map from './components/Map.tsx';
import { useState } from 'react';
import type { Coords } from '../types.ts';

function App() {
  const [coords, setCoords] = useState<Coords>({ lat: 50.46, lon: 30.46 });

  const onMapClick = (lat: number, lon: number) => {
    setCoords({ lat, lon });
  };

  return (
    <div className="flex flex-col gap-8">
      <Map coords={coords} onMapClick={onMapClick} />
      <CurrentWeather coords={coords} />
      <HourlyForecast coords={coords} />
      <DailyForecast coords={coords} />
      <AdditionalInfo coords={coords} />
    </div>
  );
}

export default App;
