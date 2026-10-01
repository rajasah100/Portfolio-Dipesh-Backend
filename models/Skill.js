import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    group: {
      type: String,
      enum: ["frontend", "backend", "database", "tools", "other"],
      default: "other",
    },
    level: { type: Number, min: 0, max: 100, default: 70 },
    icon: { url: String, publicId: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
