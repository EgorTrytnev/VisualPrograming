import { describe, expect, it, vi } from 'vitest';
import {
  buildAirPollutionUrl,
  buildForecastUrl,
  buildGeocodingUrl,
  fetchAirPollution,
  fetchForecast,
  fetchJson,
  resolveCity
} from './weatherApi';

describe('weatherApi', () => {
  const apiKey = 'test-key';

  it('fetchJson возвращает данные при ok=true', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ result: 1 })
    });

    await expect(fetchJson<{ result: number }>('https://test', mockFetch as any)).resolves.toEqual({
      result: 1
    });
  });

  it('fetchJson бросает ошибку при ok=false', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchJson('https://test', mockFetch as any)).rejects.toThrow('Ошибка API: 500');
  });

  it('resolveCity возвращает первый найденный город', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        { name: 'Novosibirsk', lat: 55.03, lon: 82.92, country: 'RU' },
        { name: 'Other', lat: 1, lon: 1 }
      ])
    });

    await expect(resolveCity('Novosibirsk', apiKey, mockFetch as any)).resolves.toEqual({
      name: 'Novosibirsk',
      lat: 55.03,
      lon: 82.92,
      country: 'RU'
    });
  });

  it('resolveCity бросает ошибку, если город не найден', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([])
    });

    await expect(resolveCity('UnknownCity', apiKey, mockFetch as any)).rejects.toThrow('Город не найден');
  });

  it('fetchForecast возвращает прогноз', async () => {
    const payload = { list: [], city: { name: 'Nsk', country: 'RU' } };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(fetchForecast(55, 82, apiKey, mockFetch as any)).resolves.toEqual(payload);
  });

  it('fetchAirPollution возвращает данные воздуха', async () => {
    const payload = { list: [{ main: { aqi: 1 }, components: { co: 0, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 1, pm10: 2, nh3: 0 } }] };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload)
    });

    await expect(fetchAirPollution(55, 82, apiKey, mockFetch as any)).resolves.toEqual(payload);
  });
});
