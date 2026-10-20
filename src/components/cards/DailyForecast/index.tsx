import { useSuspenseQuery } from '@tanstack/react-query';
import type { Coords } from 'types';

import { getWeather } from '@/api';
import Card from '@/components/cards/Card';
import WeatherIcon from '@/components/WeatherIcon';

type Props = {
  coords: Coords;
};

function DailyForecast({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card
      childrenClassName="flex flex-col justify-between gap-9 text-sm lg:text-md"
      title="Daily forecast"
    >
      {data.daily.map((day) => {
        return (
          <div
            key={day.date}
            className="grid grid-cols-5 gap-4 items-center 2xl:justify-between"
          >
            <p className="">
              {new Date(`${day.date}T12:00:00Z`).toLocaleDateString(undefined, {
                weekday: 'short',
                timeZone: 'UTC',
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
