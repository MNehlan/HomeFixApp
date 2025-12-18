import api from "./api"

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data)
  return res.data
}

export const registerTechnician = async (data) => {
  const res = await api.post("/auth/register/technician", data)
  return res.data
}

export const fetchProfile = async () => {
  const res = await api.get("/user/profile")
  return res.data
}
