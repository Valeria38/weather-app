import { airPollutionSchema } from './schemas/airPollutionSchema';
import { geocodeSchema } from './schemas/geocodeSchema';
import { weatherSchema } from './schemas/weatherSchema';

export const API_KEY = import.meta.env.VITE_API_KEY;

export async function getWeather({ lat, lon }: { lat: number; lon: number }) {
  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`,
  );
  const data = await res.json();
  return weatherSchema.parse(data);
}

export async function getGeocode(location: string) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`,
  );
  const data = await res.json();
  return geocodeSchema.parse(data);
}

export async function getAirPollution({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  );
  const data = await res.json();
  return airPollutionSchema.parse(data);
}
