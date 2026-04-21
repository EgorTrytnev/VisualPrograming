import type { AirPollutionResponse } from '../types';
import { formatAqiLabel } from '../utils/weatherUtils';

interface AirQualityCardProps {
  data?: AirPollutionResponse;
}

export function AirQualityCard({ data }: AirQualityCardProps) {
  const item = data?.list?.[0];

  if (!item) {
    return <div className="card">Нет данных о загрязнении воздуха.</div>;
  }

  return (
    <div className="card">
      <h3>Качество воздуха</h3>
      <p>
        AQI: <strong>{item.main.aqi}</strong> ({formatAqiLabel(item.main.aqi)})
      </p>
      <div className="meta two-column">
        <span>PM2.5: {item.components.pm2_5}</span>
        <span>PM10: {item.components.pm10}</span>
        <span>CO: {item.components.co}</span>
        <span>NO2: {item.components.no2}</span>
      </div>
    </div>
  );
}
