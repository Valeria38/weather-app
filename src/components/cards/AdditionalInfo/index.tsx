import { useSuspenseQuery } from '@tanstack/react-query';
import type { Coords } from 'types';

import { getWeather } from '@/api';
import Cloud from '@/assets/cloud.svg?react';
import Pressure from '@/assets/pressure.svg?react';
import Sunrise from '@/assets/sunrise.svg?react';
import Sunset from '@/assets/sunset.svg?react';
import UpArrow from '@/assets/upArrow.svg?react';
import Wind from '@/assets/wind.svg?react';
import Card from '@/components/cards/Card';
import { formatTimeAtOffset } from '@/lib/date';

type Props = {
  coords: Coords;
};

function AdditionalInfo({ coords: { lat, lon } }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather({ lat, lon }),
  });

  return (
    <Card
      childrenClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
      title="Additional weather info"
    >
      {rows.map(({ label, value, Icon }) => (
        <div className="flex justify-between" key={value}>
          <div className="flex">
            <span className="text-gray-500 ">{label}</span>
            <Icon className="size-8  mx-4" />
          </div>
          <span>
            <FormatComponent
              value={value}
              number={data.current[value]}
              timezoneOffset={data.timezone_offset}
            />
          </span>
        </div>
      ))}
    </Card>
  );
}

export default AdditionalInfo;

function FormatComponent({
  value,
  number,
  timezoneOffset,
}: {
  value: string;
  number: number;
  timezoneOffset: number;
}) {
  if (value === 'sunrise' || value === 'sunset') {
    return formatTimeAtOffset(number, timezoneOffset);
  }
  if (value === 'wind_deg') {
    return (
      <UpArrow
        className=" size-8"
        data-testid="icon-wind-arrow"
        style={{
          transform: `rotate(${number}deg)`,
        }}
      />
    );
  }
  return number;
}

const rows = [
  {
    label: 'Cloudiness (%)',
    value: 'clouds',
    Icon: Cloud,
  },

  {
    label: 'Wind direction',
    value: 'wind_deg',
    Icon: Wind,
  },
  {
    label: 'Pressure (hPa)',
    value: 'pressure',
    Icon: Pressure,
  },
  {
    label: 'Sunrise',
    value: 'sunrise',
    Icon: Sunrise,
  },
  {
    label: 'Sunset',
    value: 'sunset',
    Icon: Sunset,
  },
] as const;
