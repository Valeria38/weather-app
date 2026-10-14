import { useSuspenseQuery } from '@tanstack/react-query';
import type { Coords } from 'types';

import { getWeather } from '@/api';
import Card from '@/components/cards/Card';
import WeatherIcon from '@/components/WeatherIcon';

type Props = {
  coords: Coords;
};

function HourlyForecast({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card childrenClassName="min-w-0" title="Hourly forecast(48 hours)">
      <div
        role="region"
        aria-label="48-hour forecast items"
        tabIndex={0}
        className="flex w-full gap-6 overflow-x-auto"
      >
        {data.hourly.map((hour) => (
          <div
            key={hour.dt}
            className="flex flex-col gap-2 items-center p-2 2xl:justify-between"
          >
            <p className="whitespace-nowrap 2xl:scale-110">
              {new Date(hour.dt * 1000).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            <WeatherIcon className="2xl:size-10" src={hour.weather[0].icon} />
            <p className=" 2xl:scale-110">{Math.round(hour.temp)} °C</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HourlyForecast;
