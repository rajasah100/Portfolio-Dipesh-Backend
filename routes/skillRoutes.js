import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  upsertSkillIcon,
} from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/icon", protect, upload.single("icon"), upsertSkillIcon);
router.post("/", protect, upload.single("icon"), createSkill);
router.put("/:id", protect, upload.single("icon"), updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
