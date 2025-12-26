import express from "express"
import { addRating, getReviews } from "../controllers/ratingController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isCustomer } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/", verifyToken, isCustomer, addRating)
router.get("/:technicianId", getReviews)


export default router
