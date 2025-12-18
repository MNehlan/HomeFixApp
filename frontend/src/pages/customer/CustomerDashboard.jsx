import { useEffect, useState } from "react"
import {
  searchTechnicians,
} from "../../services/technicianService"
import TechnicianCard from "../../components/technician/TechnicianCard"
import TechnicianFilters from "../../components/technician/TechnicianFilters"
import { useNavigate } from "react-router-dom"

const CustomerDashboard = () => {
  const [technicians, setTechnicians] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    minRating: "",
    sortByPrice: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loadTechnicians = async () => {
    setLoading(true)
    const data = await searchTechnicians(filters)
    setTechnicians(data)
    setLoading(false)
  }

  useEffect(() => {
    loadTechnicians()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Find Technicians</h1>

      <TechnicianFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={loadTechnicians}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {technicians.map((tech) => (
            <TechnicianCard
              key={tech.technicianId}
              technician={tech}
            />
          ))}
        </div>
      )}

      <div className="border rounded p-4">
        <h2 className="font-semibold text-lg mb-1">Want to become a technician?</h2>
        <p className="text-sm text-gray-600">
          Grow your business with verified profiles and ratings.
        </p>
        <button
          onClick={() => navigate("/partner")}
          className="mt-3 px-4 py-2 rounded bg-black text-white"
        >
          Partner With Us
        </button>
      </div>
    </div>
  )
}

export default CustomerDashboard
