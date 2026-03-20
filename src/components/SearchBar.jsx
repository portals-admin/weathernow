import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ onSearch, onSelect, results, searching }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => onSearch(query), 300)
    }
    return () => clearTimeout(debounceRef.current)
  }, [query, onSearch])

  useEffect(() => {
    setOpen(results.length > 0)
  }, [results])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(city) {
    setQuery(city.label)
    setOpen(false)
    onSelect(city)
  }

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
          aria-label="Search city"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-results"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {open && (
        <ul id="search-results" role="listbox" className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
          {results.map((city, i) => (
            <li
              key={`${city.lat}-${city.lon}-${i}`}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(city)}
              className="px-4 py-3 cursor-pointer hover:bg-white/10 transition text-left text-sm text-slate-200 border-b border-white/5 last:border-b-0"
            >
              <span className="font-medium text-white">{city.name}</span>
              {city.state && <span className="text-slate-400">, {city.state}</span>}
              <span className="text-slate-400">, {city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
