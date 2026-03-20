const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 'demo'
const BASE_URL = 'https://api.openweathermap.org'

export class WeatherServiceError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'WeatherServiceError'
    this.code = code
  }
}

function handleApiError(status, data) {
  if (status === 401) throw new WeatherServiceError('Invalid API key. Please check your configuration.', 401)
  if (status === 404) throw new WeatherServiceError('Location not found. Please try a different search.', 404)
  if (status === 429) throw new WeatherServiceError('Too many requests. Please wait a moment and try again.', 429)
  throw new WeatherServiceError(data?.message || 'Failed to fetch weather data.', status)
}

async function fetchApi(url) {
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new WeatherServiceError('Network error. Please check your connection.', 0)
  }
  const data = await res.json()
  if (!res.ok) handleApiError(res.status, data)
  return data
}

export function formatCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys?.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    dt: data.dt,
    lat: data.coord.lat,
    lon: data.coord.lon,
  }
}

export function formatForecast(data) {
  const daily = {}
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    if (!daily[date]) {
      daily[date] = { date, temps: [], icons: [], descriptions: [], humidity: [], wind: [] }
    }
    daily[date].temps.push(item.main.temp)
    daily[date].icons.push(item.weather[0].icon)
    daily[date].descriptions.push(item.weather[0].description)
    daily[date].humidity.push(item.main.humidity)
    daily[date].wind.push(item.wind.speed)
  })

  return Object.values(daily).slice(0, 5).map((day) => ({
    date: day.date,
    tempHigh: Math.round(Math.max(...day.temps)),
    tempLow: Math.round(Math.min(...day.temps)),
    icon: getMostFrequent(day.icons),
    description: getMostFrequent(day.descriptions),
    humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
    windSpeed: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 3.6),
  }))
}

function getMostFrequent(arr) {
  const freq = {}
  arr.forEach((v) => { freq[v] = (freq[v] || 0) + 1 })
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0]
}

export async function getCurrentWeather(lat, lon) {
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  const data = await fetchApi(url)
  return formatCurrentWeather(data)
}

export async function getForecast(lat, lon) {
  const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  const data = await fetchApi(url)
  return formatForecast(data)
}

export async function searchCities(query) {
  if (!query || query.length < 2) return []
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  const data = await fetchApi(url)
  return data.map((city) => ({
    name: city.name,
    country: city.country,
    state: city.state || '',
    lat: city.lat,
    lon: city.lon,
    label: [city.name, city.state, city.country].filter(Boolean).join(', '),
  }))
}

export async function getWeatherByCity(lat, lon) {
  const [current, forecast] = await Promise.all([
    getCurrentWeather(lat, lon),
    getForecast(lat, lon),
  ])
  return { current, forecast }
}
