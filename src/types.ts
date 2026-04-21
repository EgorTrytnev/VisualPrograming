export interface CityCoordinates {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface AirPollutionResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}
