import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  initiateChat,
  sendMessage,
  getUserChats,
  getMessages
} from "../controllers/chatController.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", initiateChat);
router.get("/", getUserChats);
router.post("/:chatId/messages", sendMessage);
router.get("/:chatId/messages", getMessages);

export default router;
