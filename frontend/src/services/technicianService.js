import api from "./api"

/**
 * Apply to become technician
 */
export const applyTechnician = async (data) => {
  const res = await api.post("/technician/apply", data)
  return res.data
}

/**
 * Get logged-in technician profile
 */
export const getTechnicianProfile = async () => {
  const res = await api.get("/technician/profile")
  return res.data
}

/**
 * Search technicians (customer)
 */
export const searchTechnicians = async (params) => {
  const res = await api.get("/search", { params })
  return res.data
}

/**
 * Rate a technician (customer)
 */
export const rateTechnician = async (technicianId, rating, review) => {
  const res = await api.post("/rating", {
    technicianId,
    rating: Number(rating),
    review,
  })
  return res.data
}
