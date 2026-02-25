import api from "./api"

export const getPendingTechnicians = async () => {
  const res = await api.get("/admin/pending-technicians")
  return res.data
}

export const verifyTechnician = async (userId, status, rejectionReason) => {
  return api.post("/admin/verify", {
    userId,
    status, // APPROVED or REJECTED
    rejectionReason,
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

export const deleteUser = async (userId) => {
  const res = await api.post("/admin/delete-user", { userId })
  return res.data
}

export const getReports = async () => {
  const res = await api.get("/reports")
  return res.data
}

export const resolveReport = async (id, status, adminNotes) => {
  const res = await api.put(`/reports/${id}/resolve`, { status, adminNotes })
  return res.data
}