import api from "./api"

export const getHomeData = async () => {
    const res = await api.get("/home")
    return res.data
}
