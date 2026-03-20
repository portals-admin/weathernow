import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForecastCard from './ForecastCard'

const mockDay = {
  date: 'Mon, Nov 20',
  tempHigh: 18,
  tempLow: 12,
  icon: '04d',
  description: 'cloudy',
  humidity: 70,
  windSpeed: 15,
}

describe('ForecastCard', () => {
  it('renders date and temperatures', () => {
    render(<ForecastCard day={mockDay} />)
    expect(screen.getByText('Mon, Nov 20')).toBeInTheDocument()
    expect(screen.getByText('18°')).toBeInTheDocument()
    expect(screen.getByText('12°')).toBeInTheDocument()
  })

  it('renders description and weather details', () => {
    render(<ForecastCard day={mockDay} />)
    expect(screen.getByText('cloudy')).toBeInTheDocument()
  })

  it('renders weather icon', () => {
    render(<ForecastCard day={mockDay} />)
    const img = screen.getByAltText('cloudy')
    expect(img).toBeInTheDocument()
  })
})
