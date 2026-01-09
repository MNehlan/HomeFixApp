import express from "express"
import { createJob, getJobs, getJobById, updateJobStatus } from "../controllers/jobController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

router.post("/", createJob)
router.get("/", getJobs)
router.get("/:id", getJobById)
router.patch("/:id/status", updateJobStatus)

export default router
