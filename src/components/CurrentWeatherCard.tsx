import type { ForecastItem } from '../types';
import { formatDateTime, formatTemperature, getWeatherIconUrl } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  cityLabel: string;
  item?: ForecastItem;
}

export function CurrentWeatherCard({ cityLabel, item }: CurrentWeatherCardProps) {
  if (!item) {
    return <div className="card">Нет данных по погоде.</div>;
  }

  const weather = item.weather[0];

  return (
    <div className="card">
      <h2>{cityLabel}</h2>
      <p>{formatDateTime(item.dt_txt)}</p>
      <div className="weather-main">
        <img src={getWeatherIconUrl(weather.icon)} alt={weather.description} />
        <div>
          <div className="temp">{formatTemperature(item.main.temp)}</div>
          <div>{weather.description}</div>
        </div>
      </div>
      <div className="meta">
        <span>Ощущается: {formatTemperature(item.main.feels_like)}</span>
        <span>Влажность: {item.main.humidity}%</span>
        <span>Ветер: {item.wind.speed} м/с</span>
      </div>
    </div>
  );
}
