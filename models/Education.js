import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    format: String,
  },
  { _id: true, timestamps: true }
);

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    kind: {
      type: String,
      enum: ["degree", "certification", "course"],
      default: "degree",
    },
    period: { type: String, required: true },   // e.g. "2021 — 2025"
    label: String,                              // e.g. "Bachelor's degree"
    description: { type: String, maxlength: 600 },
    certificates: [certificateSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
