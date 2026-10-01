import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "gallery", maxCount: 6 },
]);

router.get("/", getProjects);
router.get("/:slug", getProject);
router.post("/", protect, uploadFields, createProject);
router.put("/:id", protect, uploadFields, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
