import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AirQualityCard } from './AirQualityCard';
import { CitySearch } from './CitySearch';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { ForecastList } from './ForecastList';

const forecastItem = {
  dt: 1700000000,
  dt_txt: '2026-04-21 12:00:00',
  main: {
    temp: 12.4,
    feels_like: 10.2,
    humidity: 66
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'ясно',
      icon: '01d'
    }
  ],
  wind: {
    speed: 3.5
  }
};

describe('components render', () => {
  it('CitySearch рендерит заголовок и кнопку', () => {
    const html = renderToStaticMarkup(
      <CitySearch city="Novosibirsk" loading={false} onCityChange={() => undefined} onSearch={() => undefined} />
    );

    expect(html).toContain('Прогноз погоды');
    expect(html).toContain('Найти');
    expect(html).toContain('Введите город');
  });

  it('CurrentWeatherCard рендерит данные погоды', () => {
    const html = renderToStaticMarkup(<CurrentWeatherCard cityLabel="Novosibirsk, RU" item={forecastItem} />);

    expect(html).toContain('Novosibirsk, RU');
    expect(html).toContain('ясно');
    expect(html).toContain('12°C');
    expect(html).toContain('Ощущается: 10°C');
  });

  it('AirQualityCard рендерит AQI и компоненты', () => {
    const html = renderToStaticMarkup(
      <AirQualityCard
        data={{
          list: [
            {
              main: { aqi: 2 },
              components: { co: 1, no: 0, no2: 4, o3: 0, so2: 0, pm2_5: 3, pm10: 5, nh3: 0 }
            }
          ]
        }}
      />
    );

    expect(html).toContain('Качество воздуха');
    expect(html).toContain('AQI');
    expect(html).toContain('Удовлетворительно');
    expect(html).toContain('PM2.5: 3');
  });

  it('ForecastList показывает по одной записи на день', () => {
    const html = renderToStaticMarkup(
      <ForecastList
        items={[
          { ...forecastItem, dt: 1, dt_txt: '2026-04-21 03:00:00', weather: [{ ...forecastItem.weather[0], description: 'день-1' }] },
          { ...forecastItem, dt: 2, dt_txt: '2026-04-21 06:00:00', weather: [{ ...forecastItem.weather[0], description: 'день-1-лишний' }] },
          { ...forecastItem, dt: 3, dt_txt: '2026-04-22 03:00:00', weather: [{ ...forecastItem.weather[0], description: 'день-2' }] }
        ]}
      />
    );

    expect(html).toContain('Прогноз на несколько дней');
    expect(html).toContain('день-1');
    expect(html).toContain('день-2');
    expect(html).not.toContain('день-1-лишний');
  });
});
