import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    summary: { type: String, required: true, maxlength: 220 },
    description: { type: String, required: true },
    stack: [{ type: String }],
    category: {
      type: String,
      enum: ["web", "mobile", "api", "ui", "other"],
      default: "web",
    },
    cover: {
      url: String,
      publicId: String,
    },
    gallery: [
      {
        url: String,
        publicId: String,
      },
    ],
    liveUrl: String,
    repoUrl: String,
    year: { type: Number, default: () => new Date().getFullYear() },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.model("Project", projectSchema);
