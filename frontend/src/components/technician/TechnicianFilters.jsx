import { useState, useEffect } from "react"
import { getTechnicianCities, getTechnicianCategories } from "../../services/technicianService"

const TechnicianFilters = ({ filters, setFilters, onSearch }) => {
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getTechnicianCities().then(setCities).catch(console.error)
    getTechnicianCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City</label>
        <select
          className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:bg-white"
          value={filters.city || ""}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
        <select
          className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:bg-white"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Min Rating</label>
        <select
          className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:bg-white"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sort Price</label>
        <select
          className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:bg-white"
          value={filters.sortByPrice}
          onChange={(e) => setFilters({ ...filters, sortByPrice: e.target.value })}
        >
          <option value="">Default</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      <button
        onClick={onSearch}
        className="bg-black text-white py-3.5 rounded-xl w-full font-bold hover:opacity-90 transition-all shadow-lg shadow-black/10 active:scale-[0.98] mt-4"
      >
        Apply Filters
      </button>
    </div>
  )
}

export default TechnicianFilters
