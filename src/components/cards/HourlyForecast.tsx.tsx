import React from 'react';
import Card from './Card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getWeather } from '../../api';
import WeatherIcon from '../WeatherIcon';
import type { Coords } from '../../../types';

type Props = {
  coords: Coords;
};

function HourlyForecast({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card
      childrenClassName="flex gap-6 overflow-x-scroll"
      title="Hourly forecast(48 hours)"
    >
      {data.hourly.map((hour) => (
        <div key={hour.dt} className="flex flex-col gap-2 items-center p-2">
          <p className="whitespace-nowrap">
            {new Date(hour.dt * 1000).toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
          <WeatherIcon src={hour.weather[0].icon} />
          <p>{Math.round(hour.temp)} °C</p>
        </div>
      ))}
    </Card>
  );
}

export default HourlyForecast;
