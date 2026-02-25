import express from "express";
import { createReport, getAllReports, resolveReport } from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createReport);
router.get("/", verifyToken, isAdmin, getAllReports);
router.put("/:id/resolve", verifyToken, isAdmin, resolveReport);

export default router;
