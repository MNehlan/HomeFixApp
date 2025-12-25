console.log("🚀 SERVER STARTED - REAL FILE")
import dotenv from "dotenv"
dotenv.config()

import app from "./app.js"
import { bootstrapAdmin } from "./utils/bootstrapAdmin.js"

const PORT = 5555 // Moving to 5555 to verify Control

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await bootstrapAdmin()
}).on("error", (err) => {
  console.error("Server failed to start:", err)
})
