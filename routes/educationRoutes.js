import express from "express";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  addCertificates,
  removeCertificate,
} from "../controllers/educationController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getEducation);
router.post("/", protect, createEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

// Certificates: images or PDFs, up to 5 per request.
router.post("/:id/certificates", protect, upload.array("certificates", 5), addCertificates);
router.delete("/:id/certificates/:certId", protect, removeCertificate);

export default router;
