import api from "./api"

export const getPendingTechnicians = async () => {
  const res = await api.get("/admin/pending-technicians")
  return res.data
}

export const verifyTechnician = async (userId, status) => {
  return api.post("/admin/verify", {
    userId,
    status, // APPROVED or REJECTED
  })
}

export const getAllUsers = async () => {
  const res = await api.get("/admin/users")
  return res.data
}

export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats")
  return res.data
}