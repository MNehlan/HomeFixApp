import express from "express"
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import technicianRoutes from "./routes/technicianRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import ratingRoutes from "./routes/ratingRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import homeRoutes from "./routes/homeRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/technician", technicianRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/home", homeRoutes)

export default app
