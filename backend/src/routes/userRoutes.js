import express from "express"
import { getProfile, updateProfile } from "../controllers/userController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { upload } from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.get("/profile", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("image"), updateProfile)

export default router
