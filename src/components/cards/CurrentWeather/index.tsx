import { useSuspenseQuery } from '@tanstack/react-query';
import type { Coords } from 'types';

import { getWeather } from '@/api';
import Card from '@/components/cards/Card';
import WeatherIcon from '@/components/WeatherIcon';
import { formatTimeAtOffset } from '@/lib/date';

type Props = {
  coords: Coords;
};

function CurrentWeather({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card
      title="Current Weather"
      className="md:pb-11"
      childrenClassName="flex flex-col items-center gap-6 2xl:justify-between"
    >
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-6xl font-semibold text-center items-center">
          {Math.round(data.current.temp)} °C
        </h2>
        <WeatherIcon className="size-14" src={data.current.weather[0].icon} />
        <h3 className="capitalize text-xl">
          {data.current.weather[0].description}
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl text-center">Local time: </p>
        <h3 className="text-4xl font-semibold">
          {formatTimeAtOffset(data.current.dt, data.timezone_offset, 'en-US')}
        </h3>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Feels like</p>
          <p>{data.current.feels_like} °C</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Humidity</p>
          <p>{data.current.humidity} %</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Wind speed</p>
          <p>{data.current.wind_speed} mph</p>
        </div>
      </div>
    </Card>
  );
}

export default CurrentWeather;
