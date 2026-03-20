import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import GeolocationButton from './components/GeolocationButton'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import { useWeather, useSearch } from './hooks/useWeather'

function App() {
  const { weather, loading, error, fetchWeather, setError } = useWeather()
  const { results, searching, search, clearResults } = useSearch()

  function handleSelectCity(city) {
    clearResults()
    fetchWeather(city.lat, city.lon)
  }

  function handleGeolocate(lat, lon) {
    fetchWeather(lat, lon)
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Weather App
          </h1>
          <p className="text-slate-400 text-sm">
            Search for a city or use your location to get current weather and forecasts
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <SearchBar
            onSearch={search}
            onSelect={handleSelectCity}
            results={results}
            searching={searching}
          />
          <GeolocationButton onLocate={handleGeolocate} />
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {loading && <LoadingSpinner />}

        {weather && !loading && (
          <div className="space-y-6">
            <CurrentWeather data={weather.current} />
            <Forecast data={weather.forecast} />
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌤️</div>
            <p className="text-slate-400">Search for a city to see the weather</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
