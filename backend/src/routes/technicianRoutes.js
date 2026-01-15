import express from "express"
import {
  applyTechnician,
  getTechnicianProfile,
  getTechnicianCities,
  getTechnicianCategories,
  updateAvailability,
  getTechnicianById,
} from "../controllers/technicianController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/apply", verifyToken, applyTechnician)
router.put("/availability", verifyToken, updateAvailability)
router.get("/profile", verifyToken, getTechnicianProfile)
router.get("/cities", getTechnicianCities) // Public endpoint
router.get("/categories", getTechnicianCategories) // Public endpoint
router.get("/:id", getTechnicianById) // Public endpoint

export default router
