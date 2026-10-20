import {
  type CurrentWeatherResponse,
  type ForecastResponse,
  type WeatherData,
  weatherSchema,
} from '@/schemas/weatherSchema';

export function adaptWeatherResponses(
  weatherData: CurrentWeatherResponse,
  forecastData: ForecastResponse,
): WeatherData {
  const days = new Map<string, typeof forecastData.list>();
  for (const item of forecastData.list) {
    const localDate = new Date((item.dt + forecastData.city.timezone) * 1000)
      .toISOString()
      .slice(0, 10);
    const items = days.get(localDate) ?? [];
    items.push(item);
    days.set(localDate, items);
  }

  const daily = Array.from(days, ([date, items]) => {
    const aroundMidday = items.reduce((closest, item) => {
      const localHour = new Date(
        (item.dt + forecastData.city.timezone) * 1000,
      ).getUTCHours();
      const closestHour = new Date(
        (closest.dt + forecastData.city.timezone) * 1000,
      ).getUTCHours();
      return Math.abs(localHour - 12) < Math.abs(closestHour - 12)
        ? item
        : closest;
    });

    return {
      date,
      temp: {
        day: aroundMidday.main.temp,
        min: Math.min(...items.map((item) => item.main.temp)),
        max: Math.max(...items.map((item) => item.main.temp)),
      },
      weather: aroundMidday.weather,
    };
  });

  return weatherSchema.parse({
    lat: weatherData.coord.lat,
    lon: weatherData.coord.lon,
    timezone_offset: weatherData.timezone,
    current: {
      dt: weatherData.dt,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      clouds: weatherData.clouds.all,
      visibility: weatherData.visibility,
      wind_speed: weatherData.wind.speed,
      wind_deg: weatherData.wind.deg,
      weather: weatherData.weather,
    },
    hourly: forecastData.list.map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather,
    })),
    daily,
  });
}
