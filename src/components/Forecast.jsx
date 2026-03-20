import ForecastCard from './ForecastCard'

export default function Forecast({ data }) {
  if (!data || data.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {data.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  )
}
