export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-label="Loading weather data">
      <div className="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
      <p className="text-slate-400 mt-4 text-sm">Loading weather data...</p>
    </div>
  )
}
