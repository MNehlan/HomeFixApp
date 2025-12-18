import dotenv from "dotenv"
dotenv.config()

import app from "./app.js"
import { bootstrapAdmin } from "./utils/bootstrapAdmin.js"

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await bootstrapAdmin()
})
