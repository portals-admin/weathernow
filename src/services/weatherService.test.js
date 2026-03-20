import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatCurrentWeather,
  formatForecast,
  getCurrentWeather,
  getForecast,
  searchCities,
  WeatherServiceError,
} from './weatherService'

const mockCurrentData = {
  name: 'London',
  sys: { country: 'GB' },
  main: { temp: 15.4, feels_like: 13.2, humidity: 72 },
  wind: { speed: 5.1 },
  weather: [{ description: 'overcast clouds', icon: '04d' }],
  coord: { lat: 51.51, lon: -0.13 },
  dt: 1700000000,
}

const mockForecastData = {
  list: [
    {
      dt: 1700000000,
      main: { temp: 14, humidity: 70 },
      weather: [{ description: 'cloudy', icon: '04d' }],
      wind: { speed: 4 },
    },
    {
      dt: 1700010000,
      main: { temp: 16, humidity: 65 },
      weather: [{ description: 'cloudy', icon: '04d' }],
      wind: { speed: 5 },
    },
    {
      dt: 1700086400,
      main: { temp: 12, humidity: 80 },
      weather: [{ description: 'rain', icon: '10d' }],
      wind: { speed: 7 },
    },
    {
      dt: 1700096400,
      main: { temp: 18, humidity: 60 },
      weather: [{ description: 'sunny', icon: '01d' }],
      wind: { speed: 3 },
    },
  ],
}

describe('formatCurrentWeather', () => {
  it('formats raw API data correctly', () => {
    const result = formatCurrentWeather(mockCurrentData)
    expect(result.city).toBe('London')
    expect(result.country).toBe('GB')
    expect(result.temp).toBe(15)
    expect(result.feelsLike).toBe(13)
    expect(result.humidity).toBe(72)
    expect(result.windSpeed).toBe(18)
    expect(result.description).toBe('overcast clouds')
    expect(result.icon).toBe('04d')
    expect(result.lat).toBe(51.51)
    expect(result.lon).toBe(-0.13)
  })
})

describe('formatForecast', () => {
  it('groups forecast items by date and calculates daily stats', () => {
    const result = formatForecast(mockForecastData)
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0]).toHaveProperty('date')
    expect(result[0]).toHaveProperty('tempHigh')
    expect(result[0]).toHaveProperty('tempLow')
    expect(result[0]).toHaveProperty('icon')
    expect(result[0]).toHaveProperty('description')
    expect(result[0]).toHaveProperty('humidity')
    expect(result[0]).toHaveProperty('windSpeed')
  })

  it('limits output to 5 days', () => {
    const result = formatForecast(mockForecastData)
    expect(result.length).toBeLessThanOrEqual(5)
  })

  it('calculates correct high/low temperatures', () => {
    const result = formatForecast(mockForecastData)
    // Each day should have tempHigh >= tempLow
    result.forEach((day) => {
      expect(day.tempHigh).toBeGreaterThanOrEqual(day.tempLow)
    })
  })
})

describe('API error handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('throws WeatherServiceError on 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid API key' }),
    }))
    await expect(getCurrentWeather(51, -0.1)).rejects.toThrow(WeatherServiceError)
    await expect(getCurrentWeather(51, -0.1)).rejects.toThrow('Invalid API key')
  })

  it('throws WeatherServiceError on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'city not found' }),
    }))
    await expect(getCurrentWeather(51, -0.1)).rejects.toThrow('Location not found')
  })

  it('throws WeatherServiceError on 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ message: 'too many requests' }),
    }))
    await expect(getCurrentWeather(51, -0.1)).rejects.toThrow('Too many requests')
  })

  it('throws WeatherServiceError on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(getCurrentWeather(51, -0.1)).rejects.toThrow('Network error')
  })

  it('returns empty array for short search queries', async () => {
    const result = await searchCities('a')
    expect(result).toEqual([])
  })

  it('returns empty array for empty search queries', async () => {
    const result = await searchCities('')
    expect(result).toEqual([])
  })

  it('formats search results with labels', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { name: 'London', country: 'GB', state: 'England', lat: 51.5, lon: -0.1 },
      ]),
    }))
    const result = await searchCities('London')
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('London, England, GB')
    expect(result[0].lat).toBe(51.5)
  })

  it('getForecast throws on API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Internal server error' }),
    }))
    await expect(getForecast(51, -0.1)).rejects.toThrow(WeatherServiceError)
  })
})
