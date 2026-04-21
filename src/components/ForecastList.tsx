import type { ForecastItem } from '../types';
import { formatDateTime, formatTemperature, getWeatherIconUrl } from '../utils/weatherUtils';

interface ForecastListProps {
  items: ForecastItem[];
}

function pickDailyItems(items: ForecastItem[]): ForecastItem[] {
  return items.filter((item, index) => {
    if (index === 0) {
      return true;
    }

    const previousDay = items[index - 1].dt_txt.slice(0, 10);
    const currentDay = item.dt_txt.slice(0, 10);

    return currentDay !== previousDay;
  });
}

export function ForecastList({ items }: ForecastListProps) {
  const dailyItems = pickDailyItems(items);

  return (
    <div className="card">
      <h3>Прогноз на несколько дней</h3>
      <div className="forecast-grid">
        {dailyItems.map((item) => {
          const weather = item.weather[0];

          return (
            <div key={item.dt} className="forecast-item">
              <div>{formatDateTime(item.dt_txt)}</div>
              <img src={getWeatherIconUrl(weather.icon)} alt={weather.description} />
              <strong>{formatTemperature(item.main.temp)}</strong>
              <small>{weather.description}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
