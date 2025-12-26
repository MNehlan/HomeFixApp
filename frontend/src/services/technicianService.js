import api from "./api"

/**
 * Apply to become technician
 */
export const applyTechnician = async (data) => {
  const res = await api.post("/technician/apply", data)
  return res.data
}

/**
 * Toggle technician availability
 */
export const toggleAvailability = async (isAvailable) => {
  const res = await api.put("/technician/availability", { isAvailable })
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

/**
 * Get technician reviews
 */
export const getTechnicianReviews = async (technicianId) => {
  const res = await api.get(`/rating/${technicianId}`)
  return res.data
}

export const getTechnicianCities = async () => {
  const res = await api.get("/technician/cities")
  return res.data
}

export const getTechnicianCategories = async () => {
  const res = await api.get("/technician/categories")
  return res.data
}
