import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProfile);
router.put("/", protect, upload.single("photo"), updateProfile);

export default router;
