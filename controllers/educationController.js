import Education from "../models/Education.js";
import { destroyImage } from "../config/cloudinary.js";

export const getEducation = async (req, res) => {
  const items = await Education.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
};

// Only these fields come from the form; certificates are managed by their own routes.
const pickFields = (body) => {
  const out = {};
  ["title", "organization", "kind", "period", "label", "description", "order"].forEach((k) => {
    if (body[k] !== undefined) out[k] = body[k];
  });
  return out;
};

export const createEducation = async (req, res) => {
  const item = await Education.create(pickFields(req.body));
  res.status(201).json(item);
};

export const updateEducation = async (req, res) => {
  const item = await Education.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "That entry isn't here." });
  res.json(item);
};

export const deleteEducation = async (req, res) => {
  const item = await Education.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "That entry isn't here." });

  // Remove every certificate from Cloudinary before dropping the document.
  await Promise.all(item.certificates.map((c) => destroyImage(c.publicId)));
  await item.deleteOne();

  res.json({ message: "Entry deleted." });
};

/** POST /api/education/:id/certificates — multipart, field name "certificates" */
export const addCertificates = async (req, res) => {
  const item = await Education.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "That entry isn't here." });

  if (!req.files?.length) {
    return res.status(400).json({ message: "Choose at least one file to upload." });
  }

  req.files.forEach((file) => {
    item.certificates.push({
      name: req.body.name || file.originalname,
      url: file.path,
      publicId: file.filename,
      format: file.mimetype.split("/")[1],
    });
  });

  await item.save();
  res.status(201).json(item);
};

/** DELETE /api/education/:id/certificates/:certId */
export const removeCertificate = async (req, res) => {
  const item = await Education.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "That entry isn't here." });

  const cert = item.certificates.id(req.params.certId);
  if (!cert) return res.status(404).json({ message: "That certificate isn't here." });

  await destroyImage(cert.publicId);
  cert.deleteOne();
  await item.save();

  res.json(item);
};
