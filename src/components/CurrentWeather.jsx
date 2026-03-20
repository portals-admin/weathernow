export default function CurrentWeather({ data }) {
  if (!data) return null

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">
            {data.city}{data.country && <span className="text-slate-400 text-lg ml-2">{data.country}</span>}
          </h2>
          <p className="text-6xl font-light text-white mt-2">{data.temp}°C</p>
          <p className="text-slate-300 capitalize mt-1">{data.description}</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
            alt={data.description}
            className="w-28 h-28 drop-shadow-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <WeatherStat label="Feels Like" value={`${data.feelsLike}°C`} icon="🌡️" />
        <WeatherStat label="Humidity" value={`${data.humidity}%`} icon="💧" />
        <WeatherStat label="Wind" value={`${data.windSpeed} km/h`} icon="💨" />
      </div>
    </div>
  )
}

function WeatherStat({ label, value, icon }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-white font-semibold text-sm">{value}</p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  )
}
