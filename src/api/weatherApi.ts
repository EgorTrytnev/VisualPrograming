import type { AirPollutionResponse, CityCoordinates, ForecastResponse } from '../types';

const API_BASE = 'https://api.openweathermap.org';

export function buildGeocodingUrl(city: string, apiKey: string, limit = 1): string {
  const params = new URLSearchParams({ q: city, limit: String(limit), appid: apiKey });
  return `${API_BASE}/geo/1.0/direct?${params.toString()}`;
}

export function buildForecastUrl(
  lat: number,
  lon: number,
  apiKey: string,
  units = 'metric',
  lang = 'ru'
): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units,
    lang
  });
  return `${API_BASE}/data/2.5/forecast?${params.toString()}`;
}

export function buildAirPollutionUrl(lat: number, lon: number, apiKey: string): string {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), appid: apiKey });
  return `${API_BASE}/data/2.5/air_pollution?${params.toString()}`;
}

export async function fetchJson<T>(url: string, fetchFn: typeof fetch = fetch): Promise<T> {
  const response = await fetchFn(url);

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function resolveCity(
  city: string,
  apiKey: string,
  fetchFn: typeof fetch = fetch
): Promise<CityCoordinates> {
  const url = buildGeocodingUrl(city, apiKey);
  const data = await fetchJson<CityCoordinates[]>(url, fetchFn);

  if (!data.length) {
    throw new Error('Город не найден');
  }

  return data[0];
}

export async function fetchForecast(
  lat: number,
  lon: number,
  apiKey: string,
  fetchFn: typeof fetch = fetch
): Promise<ForecastResponse> {
  return fetchJson<ForecastResponse>(buildForecastUrl(lat, lon, apiKey), fetchFn);
}

export async function fetchAirPollution(
  lat: number,
  lon: number,
  apiKey: string,
  fetchFn: typeof fetch = fetch
): Promise<AirPollutionResponse> {
  return fetchJson<AirPollutionResponse>(buildAirPollutionUrl(lat, lon, apiKey), fetchFn);
}
