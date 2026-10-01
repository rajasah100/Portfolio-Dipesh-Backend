import mongoose from "mongoose";

/**
 * Singleton document holding everything on the page that isn't a list:
 * hero copy, about paragraphs, stats and contact details.
 */
const profileSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    // Hero
    name: { type: String, default: "Dipesh Mahato" },
    roles: { type: [String], default: ["Full-Stack Developer"] },
    badge: { type: String, default: "Available for freelance & full-time" },
    tagline: { type: String, default: "" },

    // About
    aboutTitle: { type: String, default: "Turning ideas into working products" },
    aboutParagraphs: { type: [String], default: [] },
    photo: { url: String, publicId: String },
    floatCards: {
      type: [{ value: String, label: String }],
      default: [],
    },
    stats: {
      type: [{ value: Number, label: String }],
      default: [],
    },

    // Contact
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    responseTime: { type: String, default: "Usually within 24 hours" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
