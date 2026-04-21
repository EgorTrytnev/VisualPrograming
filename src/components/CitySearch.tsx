interface CitySearchProps {
  city: string;
  loading: boolean;
  onCityChange: (value: string) => void;
  onSearch: () => void;
}

export function CitySearch({ city, loading, onCityChange, onSearch }: CitySearchProps) {
  return (
    <div className="card">
      <h1>Прогноз погоды</h1>
      <div className="search-row">
        <input
          value={city}
          placeholder="Введите город"
          onChange={(event) => onCityChange(event.target.value)}
        />
        <button onClick={onSearch} disabled={loading || !city.trim()}>
          {loading ? 'Загрузка...' : 'Найти'}
        </button>
      </div>
    </div>
  );
}
