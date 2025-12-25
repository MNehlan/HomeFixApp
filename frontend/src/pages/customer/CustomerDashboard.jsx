import { useEffect, useState, useCallback } from "react"
import { searchTechnicians } from "../../services/technicianService"
import TechnicianCard from "../../components/technician/TechnicianCard"
import TechnicianFilters from "../../components/technician/TechnicianFilters"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth-context"

const CustomerDashboard = () => {
  const [technicians, setTechnicians] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    minRating: "",
    sortByPrice: "",
    city: ""
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  /* 
   * Fetches technicians based on current filters.
   * Does NOT set loading state to true itself to avoid synchronous updates in useEffect.
   */
  const fetchTechnicians = useCallback(async () => {
    try {
      const data = await searchTechnicians(filters)
      setTechnicians(data)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Wrapper for filter updates to ensure loading state is set before search triggers
  const handleFilterChange = (newFilters) => {
    setLoading(true)
    setFilters(newFilters)
  }

  // Initial load and refetch when filters change
  useEffect(() => {
    fetchTechnicians()
  }, [fetchTechnicians])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Find a Professional</h1>
            <p className="text-slate-500 text-sm mt-1">Book trusted local technicians for your home repair needs.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/partner")}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-black/20"
            >
              Become a Partner
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
              <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                Filters
              </h2>
              <TechnicianFilters
                filters={filters}
                setFilters={handleFilterChange}
                onSearch={() => {
                  setLoading(true)
                  fetchTechnicians()
                }}
              />
            </div>
          </div>

          {/* Technicians Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[300px] bg-white rounded-2xl border border-slate-100"></div>
                ))}
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">No technicians found</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4">Try adjusting your search criteria.</p>
                <button onClick={() => {
                  setFilters({ category: "", minRating: "", sortByPrice: "", city: "" })
                }} className="text-emerald-600 font-semibold text-sm hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                  <TechnicianCard
                    key={tech.technicianId}
                    technician={tech}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default CustomerDashboard
