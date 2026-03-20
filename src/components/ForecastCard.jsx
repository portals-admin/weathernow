export default function ForecastCard({ day }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center hover:bg-white/15 transition">
      <p className="text-slate-300 text-sm font-medium mb-2">{day.date}</p>
      <img
        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
        alt={day.description}
        className="w-16 h-16 mx-auto"
      />
      <div className="flex justify-center gap-2 mt-1">
        <span className="text-white font-semibold">{day.tempHigh}°</span>
        <span className="text-slate-400">{day.tempLow}°</span>
      </div>
      <p className="text-slate-400 text-xs capitalize mt-1">{day.description}</p>
      <div className="flex justify-center gap-3 mt-2 text-xs text-slate-400">
        <span>💧 {day.humidity}%</span>
        <span>💨 {day.windSpeed}</span>
      </div>
    </div>
  )
}
