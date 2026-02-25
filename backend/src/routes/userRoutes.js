import express from "express"
import { getProfile, updateProfile, uploadFile } from "../controllers/userController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { upload } from "../middleware/uploadMiddleware.js"

const router = express.Router()

console.log("Loading userRoutes...")

router.get("/ping", (req, res) => res.send("pong"))

router.get("/profile", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("image"), updateProfile)
router.post("/upload", verifyToken, upload.single("file"), uploadFile)

export default router
