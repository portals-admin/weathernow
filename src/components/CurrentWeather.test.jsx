import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CurrentWeather from './CurrentWeather'

const mockData = {
  city: 'London',
  country: 'GB',
  temp: 15,
  feelsLike: 13,
  humidity: 72,
  windSpeed: 18,
  description: 'overcast clouds',
  icon: '04d',
}

describe('CurrentWeather', () => {
  it('renders nothing when data is null', () => {
    const { container } = render(<CurrentWeather data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders city name and temperature', () => {
    render(<CurrentWeather data={mockData} />)
    expect(screen.getByText('15°C')).toBeInTheDocument()
    expect(screen.getByText('overcast clouds')).toBeInTheDocument()
  })

  it('renders weather stats', () => {
    render(<CurrentWeather data={mockData} />)
    expect(screen.getByText('13°C')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('18 km/h')).toBeInTheDocument()
  })

  it('renders weather icon', () => {
    render(<CurrentWeather data={mockData} />)
    const img = screen.getByAltText('overcast clouds')
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('04d')
  })
})
