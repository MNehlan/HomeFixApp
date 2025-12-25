const TechnicianFilters = ({ filters, setFilters, onSearch }) => {
  return (
    <div className="border p-4 rounded mb-4 space-y-2">
      <input
        placeholder="City / Location"
        className="border p-2 w-full"
        value={filters.city || ""}
        onChange={(e) =>
          setFilters({ ...filters, city: e.target.value })
        }
      />

      <input
        placeholder="Category"
        className="border p-2 w-full"
        value={filters.category}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
      />

      <select
        className="border p-2 w-full"
        value={filters.minRating}
        onChange={(e) =>
          setFilters({ ...filters, minRating: e.target.value })
        }
      >
        <option value="">Min Rating</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <select
        className="border p-2 w-full"
        value={filters.sortByPrice}
        onChange={(e) =>
          setFilters({ ...filters, sortByPrice: e.target.value })
        }
      >
        <option value="">Sort by Price</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>

      <button
        onClick={onSearch}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Search
      </button>
    </div>
  )
}

export default TechnicianFilters
