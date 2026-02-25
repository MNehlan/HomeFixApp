import { useEffect, useState, useCallback } from "react"
import { searchTechnicians } from "../../services/technicianService"
import TechnicianCard from "../../components/technician/TechnicianCard"
import TechnicianFilters from "../../components/technician/TechnicianFilters"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContextDefinition"

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
  const { user, logout } = useAuth()
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  const fetchTechnicians = useCallback(async () => {
    try {
      const data = await searchTechnicians(filters)
      setTechnicians(data)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setLoading(true)
    setFilters(newFilters)
  }

  useEffect(() => {
    fetchTechnicians()
  }, [fetchTechnicians])

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden pb-10">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Find a Professional</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Book trusted local technicians for your home repair needs.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate("/chat")}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs md:text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Messages
            </button>
            <button
              onClick={() => navigate("/customer/jobs")}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              My Requests
            </button>
            <button
              onClick={() => navigate("/partner")}
              className="hidden sm:block px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-black text-white text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-black/20"
            >
              Become a Partner
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 focus:outline-none"
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                    {user?.name?.[0]}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-full bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center justify-between font-bold text-slate-900 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🔍</span> Filters & Sorting
            </span>
            <span className="text-emerald-600">Edit</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Desktop) / Drawer (Mobile) */}
          <div className={`
             fixed inset-0 z-[100] bg-black/50 lg:relative lg:inset-auto lg:z-0 lg:bg-transparent lg:block
             ${isFilterDrawerOpen ? "block" : "hidden"}
          `}>
            <div
              className="lg:hidden absolute inset-0"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            <div className={`
                bg-white p-6 rounded-t-3xl lg:rounded-2xl shadow-xl lg:shadow-sm border border-slate-100 
                absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto
                lg:relative lg:bottom-auto lg:block lg:max-h-none lg:sticky lg:top-24
             `}>
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-slate-400">✕</button>
              </div>

              <TechnicianFilters
                filters={filters}
                setFilters={(f) => {
                  handleFilterChange(f)
                  // Close drawer on small screens after change if you want, or keep open
                }}
                onSearch={() => {
                  setLoading(true)
                  fetchTechnicians()
                  setIsFilterDrawerOpen(false)
                }}
              />
            </div>
          </div>

          {/* Technicians Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[280px] bg-white rounded-2xl border border-slate-100 shadow-sm"></div>
                ))}
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 mx-auto px-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">No technicians found</h3>
                <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your search criteria or clearing filters.</p>
                <button onClick={() => {
                  setFilters({ category: "", minRating: "", sortByPrice: "", city: "" })
                }} className="px-6 py-2.5 rounded-xl bg-black text-white text-sm font-bold shadow-lg shadow-black/20">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  )
}

export default CustomerDashboard
