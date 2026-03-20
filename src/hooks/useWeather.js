import { useState, useCallback } from 'react'
import { getWeatherByCity, searchCities } from '../services/weatherService'

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWeatherByCity(lat, lon)
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, loading, error, fetchWeather, setError }
}

export function useSearch() {
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const data = await searchCities(query)
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => setResults([]), [])

  return { results, searching, search, clearResults }
}
