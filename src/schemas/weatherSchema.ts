import { z } from 'zod';

const weatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const forecastItemSchema = z.object({
  dt: z.number(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(weatherConditionSchema),
  clouds: z.object({ all: z.number() }),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  visibility: z.number().optional(),
  pop: z.number(),
});

export const currentWeatherResponseSchema = z.object({
  coord: z.object({ lat: z.number(), lon: z.number() }),
  weather: z.array(weatherConditionSchema),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number().optional(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  clouds: z.object({ all: z.number() }),
  dt: z.number(),
  sys: z.object({ sunrise: z.number(), sunset: z.number() }),
  timezone: z.number(),
});
export type CurrentWeatherResponse = z.infer<
  typeof currentWeatherResponseSchema
>;

export const forecastResponseSchema = z.object({
  list: z.array(forecastItemSchema.extend({ dt_txt: z.string() })),
  city: z.object({ timezone: z.number() }),
});
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;

export const weatherSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone_offset: z.number(),
  current: z.object({
    dt: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
    temp: z.number(),
    feels_like: z.number(),
    pressure: z.number(),
    humidity: z.number(),
    clouds: z.number(),
    visibility: z.number().optional(),
    wind_speed: z.number(),
    wind_deg: z.number(),
    weather: z.array(weatherConditionSchema),
  }),
  hourly: z.array(
    z.object({
      dt: z.number(),
      temp: z.number(),
      weather: z.array(weatherConditionSchema),
    }),
  ),
  daily: z.array(
    z.object({
      date: z.string(),
      temp: z.object({
        day: z.number(),
        min: z.number(),
        max: z.number(),
      }),
      weather: z.array(weatherConditionSchema),
    }),
  ),
});

export type WeatherData = z.infer<typeof weatherSchema>;
