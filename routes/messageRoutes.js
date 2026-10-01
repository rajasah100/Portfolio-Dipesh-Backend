import express from "express";
import rateLimit from "express-rate-limit";
import { sendMessage, getMessages, markRead, deleteMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many messages from this address. Try again in 15 minutes." },
});

router.post("/", contactLimiter, sendMessage);
router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteMessage);

export default router;
