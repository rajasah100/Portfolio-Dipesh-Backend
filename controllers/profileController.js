import Profile from "../models/Profile.js";
import { destroyImage } from "../config/cloudinary.js";

/** Always returns a document — creates the singleton on first read. */
async function loadProfile() {
  let profile = await Profile.findOne({ key: "main" });
  if (!profile) profile = await Profile.create({ key: "main" });
  return profile;
}

export const getProfile = async (req, res) => {
  res.json(await loadProfile());
};

export const updateProfile = async (req, res) => {
  const profile = await loadProfile();
  const body = { ...req.body };

  // Multipart sends arrays as JSON strings; parse them back.
  ["roles", "aboutParagraphs", "stats", "floatCards"].forEach((field) => {
    if (typeof body[field] === "string") {
      try { body[field] = JSON.parse(body[field]); } catch { delete body[field]; }
    }
  });

  if (req.file) {
    await destroyImage(profile.photo?.publicId);
    profile.photo = { url: req.file.path, publicId: req.file.filename };
  }

  delete body.key;
  Object.assign(profile, body);
  await profile.save();

  res.json(profile);
};
