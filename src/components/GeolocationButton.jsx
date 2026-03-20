import { useState } from 'react'

export default function GeolocationButton({ onLocate }) {
  const [detecting, setDetecting] = useState(false)

  function handleClick() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocate(pos.coords.latitude, pos.coords.longitude)
        setDetecting(false)
      },
      () => {
        alert('Unable to detect your location. Please search manually.')
        setDetecting(false)
      },
      { timeout: 10000 }
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={detecting}
      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 hover:bg-sky-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Use my location"
    >
      {detecting ? (
        <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
      <span className="text-sm font-medium">{detecting ? 'Detecting...' : 'My Location'}</span>
    </button>
  )
}
