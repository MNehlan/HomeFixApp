import express from "express"
import {
  applyTechnician,
  getTechnicianProfile,
} from "../controllers/technicianController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/apply", verifyToken, applyTechnician)
router.get("/profile", verifyToken, getTechnicianProfile)

export default router
