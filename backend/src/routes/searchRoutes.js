import express from "express"
import { searchTechnicians } from "../controllers/searchController.js"

const router = express.Router()

router.get("/", searchTechnicians)

export default router
