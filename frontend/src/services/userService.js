import api from "./api"

export const getUserProfile = async () => {
  const res = await api.get("/user/profile")
  return res.data
}

export const updateUserProfile = async (data) => {
  const headers =
    data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {}
  return api.put("/user/profile", data, { headers })
}
