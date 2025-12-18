import express from "express"
import {
  registerTechnician,
  registerUser,
} from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/register/technician", registerTechnician)

export default router
