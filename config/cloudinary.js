import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary keys are missing from .env — image uploads will fail.");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const RASTER = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "image/gif"];
const ALLOWED = [...RASTER, "image/svg+xml", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const base = file.originalname
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 60);

    const params = {
      folder: "dipesh-portfolio",
      resource_type: "image", // PDFs and SVGs are "image" resources in Cloudinary too
      public_id: `${Date.now()}-${base}`,
    };

    // Only resize raster images on the way in. f_auto/q_auto are applied at
    // delivery time by the frontend (src/lib/cloudinary.js).
    if (RASTER.includes(file.mimetype)) {
      params.transformation = [{ width: 1600, crop: "limit" }];
    }

    return params;
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      const err = new Error("Only JPG, PNG, WEBP, AVIF, GIF, SVG or PDF files are allowed.");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

export const destroyImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

export default cloudinary;
