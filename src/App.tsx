import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAirPollution, fetchForecast, resolveCity } from './api/weatherApi';
import { AirQualityCard } from './components/AirQualityCard';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastList } from './components/ForecastList';
import type { AirPollutionResponse, ForecastResponse } from './types';
import { getBackgroundColor, getWeatherTheme, pickCurrentOrFirstForecast } from './utils/weatherUtils';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || '4af81f1d5c223163c511122479330934';

export default function App() {
  const [city, setCity] = useState('Novosibirsk');
  const [resolvedCity, setResolvedCity] = useState('Novosibirsk');
  const [forecast, setForecast] = useState<ForecastResponse | undefined>();
  const [air, setAir] = useState<AirPollutionResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const loadWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const location = await resolveCity(cityName, API_KEY);
      const [forecastData, airData] = await Promise.all([
        fetchForecast(location.lat, location.lon, API_KEY),
        fetchAirPollution(location.lat, location.lon, API_KEY)
      ]);

      setResolvedCity(`${location.name}${location.country ? `, ${location.country}` : ''}`);
      setForecast(forecastData);
      setAir(airData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось получить данные';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather(city);
  }, [loadWeather]);

  useEffect(() => {
    const timer = setInterval(() => {
      void loadWeather(city);
    }, THREE_HOURS_MS);

    return () => clearInterval(timer);
  }, [city, loadWeather]);

  const current = useMemo(() => pickCurrentOrFirstForecast(forecast?.list ?? []), [forecast]);
  const theme = getWeatherTheme(current?.weather?.[0]?.icon);
  const bgColor = getBackgroundColor(theme);

  return (
    <main style={{ backgroundColor: bgColor }}>
      <div className="container">
        <CitySearch city={city} loading={loading} onCityChange={setCity} onSearch={() => void loadWeather(city)} />
        {error && <div className="card error">Ошибка: {error}</div>}
        <CurrentWeatherCard cityLabel={resolvedCity} item={current} />
        <AirQualityCard data={air} />
        <ForecastList items={forecast?.list ?? []} />
      </div>
    </main>
  );
}
