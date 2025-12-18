import express from "express"
import {
  getAllUsers,
  getPendingTechnicians,
  verifyTechnician,
} from "../controllers/adminController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/users", verifyToken, isAdmin, getAllUsers)
router.get("/pending-technicians", verifyToken, isAdmin, getPendingTechnicians)
router.post("/verify", verifyToken, isAdmin, verifyTechnician)

export default router
