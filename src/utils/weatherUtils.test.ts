import { describe, expect, it } from 'vitest';
import {
  formatAqiLabel,
  formatDateTime,
  formatTemperature,
  getBackgroundColor,
  getWeatherIconUrl,
  getWeatherTheme,
  pickCurrentOrFirstForecast
} from './weatherUtils';

describe('weatherUtils', () => {
  it('getWeatherTheme определяет clear', () => {
    expect(getWeatherTheme('01d')).toBe('clear');
  });

  it('getWeatherTheme определяет clouds', () => {
    expect(getWeatherTheme('03n')).toBe('clouds');
  });

  it('getWeatherTheme определяет rain', () => {
    expect(getWeatherTheme('10d')).toBe('rain');
  });

  it('getWeatherTheme определяет snow', () => {
    expect(getWeatherTheme('13n')).toBe('snow');
  });

  it('getWeatherTheme определяет storm', () => {
    expect(getWeatherTheme('11d')).toBe('storm');
  });

  it('getWeatherTheme определяет mist', () => {
    expect(getWeatherTheme('50d')).toBe('mist');
  });

  it('getWeatherTheme возвращает default', () => {
    expect(getWeatherTheme()).toBe('default');
    expect(getWeatherTheme('99d')).toBe('default');
  });

  it('getBackgroundColor возвращает цвет', () => {
    expect(getBackgroundColor('clear')).toBe('#8ec5fc');
  });

  it('getWeatherIconUrl формирует URL иконки', () => {
    expect(getWeatherIconUrl('10d')).toBe('https://openweathermap.org/img/wn/10d@2x.png');
  });

  it('pickCurrentOrFirstForecast возвращает ближайший future-элемент', () => {
    const items = [
      {
        dt: 100,
        dt_txt: '1970-01-01 00:01:40',
        main: { temp: 1, feels_like: 1, humidity: 1 },
        weather: [{ id: 1, main: 'X', description: 'X', icon: '01d' }],
        wind: { speed: 1 }
      },
      {
        dt: 200,
        dt_txt: '1970-01-01 00:03:20',
        main: { temp: 2, feels_like: 2, humidity: 2 },
        weather: [{ id: 1, main: 'X', description: 'X', icon: '02d' }],
        wind: { speed: 2 }
      }
    ];

    expect(pickCurrentOrFirstForecast(items as any, 150000)?.dt).toBe(200);
  });

  it('pickCurrentOrFirstForecast возвращает первый при пустом будущем', () => {
    const items = [
      {
        dt: 100,
        dt_txt: '1970-01-01 00:01:40',
        main: { temp: 1, feels_like: 1, humidity: 1 },
        weather: [{ id: 1, main: 'X', description: 'X', icon: '01d' }],
        wind: { speed: 1 }
      }
    ];

    expect(pickCurrentOrFirstForecast(items as any, 200000)?.dt).toBe(100);
  });

  it('pickCurrentOrFirstForecast возвращает undefined для пустого списка', () => {
    expect(pickCurrentOrFirstForecast([])).toBeUndefined();
  });

  it('formatDateTime возвращает строку', () => {
    expect(typeof formatDateTime('2025-01-01 03:00:00')).toBe('string');
  });

  it('formatTemperature округляет', () => {
    expect(formatTemperature(21.7)).toBe('22°C');
  });

  it('formatAqiLabel возвращает подпись AQI', () => {
    expect(formatAqiLabel(1)).toBe('Хорошо');
    expect(formatAqiLabel(5)).toBe('Очень плохо');
    expect(formatAqiLabel(99)).toBe('Нет данных');
  });
});
