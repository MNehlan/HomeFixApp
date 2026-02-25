import express from "express"
import { addRating, getReviews, updateRating, deleteRating } from "../controllers/ratingController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isCustomer } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/", verifyToken, isCustomer, addRating)
router.get("/:technicianId", getReviews)
router.put("/:id", verifyToken, updateRating)
router.delete("/:id", verifyToken, deleteRating)


export default router
