import type { ForecastItem } from '../types';

export type WeatherTheme = 'clear' | 'clouds' | 'rain' | 'snow' | 'storm' | 'mist' | 'default';

export function getWeatherTheme(iconCode?: string): WeatherTheme {
  if (!iconCode) {
    return 'default';
  }

  if (iconCode.startsWith('01')) return 'clear';
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return 'clouds';
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rain';
  if (iconCode.startsWith('13')) return 'snow';
  if (iconCode.startsWith('11')) return 'storm';
  if (iconCode.startsWith('50')) return 'mist';

  return 'default';
}

export function getBackgroundColor(theme: WeatherTheme): string {
  const map: Record<WeatherTheme, string> = {
    clear: '#8ec5fc',
    clouds: '#b7bec8',
    rain: '#7b93a8',
    snow: '#d9e6f2',
    storm: '#5d6d7e',
    mist: '#a0a6ad',
    default: '#9fb4c7'
  };

  return map[theme];
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function pickCurrentOrFirstForecast(items: ForecastItem[], now = Date.now()): ForecastItem | undefined {
  if (!items.length) {
    return undefined;
  }

  const next = items.find((item) => item.dt * 1000 >= now);
  return next ?? items[0];
}

export function formatDateTime(dtTxt: string, locale = 'ru-RU'): string {
  return new Date(dtTxt).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatAqiLabel(aqi: number): string {
  const map: Record<number, string> = {
    1: 'Хорошо',
    2: 'Удовлетворительно',
    3: 'Умеренно',
    4: 'Плохо',
    5: 'Очень плохо'
  };

  return map[aqi] ?? 'Нет данных';
}
