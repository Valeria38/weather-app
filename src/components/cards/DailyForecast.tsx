import React from 'react';
import Card from './Card';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getWeather } from '../../api';
import WeatherIcon from '../WeatherIcon';
import type { Coords } from '../../../types';

type Props = {
  coords: Coords;
};

function DailyForecast({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card childrenClassName="flex flex-col gap-4" title="Daily forecast">
      {data.daily.map((day) => {
        return (
          <div
            key={day.dt}
            className="grid grid-cols-5 gap-4 items-left 2xl:justify-between"
          >
            <p className="">
              {new Date(day.dt * 1000).toLocaleDateString(undefined, {
                weekday: 'short',
              })}
            </p>
            <WeatherIcon src={day.weather[0].icon} />
            <p>{Math.round(day.temp.day)} °C</p>
            <p className="text-gray-500/75 ">{Math.round(day.temp.min)} °C</p>
            <p className="text-gray-500/75 ">{Math.round(day.temp.max)} °C</p>
          </div>
        );
      })}
    </Card>
  );
}

export default DailyForecast;
