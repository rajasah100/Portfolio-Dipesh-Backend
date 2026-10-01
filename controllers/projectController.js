import Project from "../models/Project.js";
import { destroyImage } from "../config/cloudinary.js";

// Images only ever come from uploaded files, never from text fields.
const cleanBody = (body) => {
  const { _id, slug, cover, gallery, createdAt, updatedAt, __v, ...payload } = body;
  if (typeof payload.stack === "string") {
    payload.stack = payload.stack.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return payload;
};

export const getProjects = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === "true") filter.featured = true;

  const projects = await Project.find(filter).sort({ order: 1, year: -1, createdAt: -1 });
  res.json(projects);
};

export const getProject = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ message: "That project isn't here." });
  res.json(project);
};

export const createProject = async (req, res) => {
  const payload = cleanBody(req.body);

  if (req.files?.cover?.[0]) {
    payload.cover = { url: req.files.cover[0].path, publicId: req.files.cover[0].filename };
  }
  if (req.files?.gallery?.length) {
    payload.gallery = req.files.gallery.map((f) => ({ url: f.path, publicId: f.filename }));
  }

  const project = await Project.create(payload);
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "That project isn't here." });

  const payload = cleanBody(req.body);

  if (req.files?.cover?.[0]) {
    await destroyImage(project.cover?.publicId);
    payload.cover = { url: req.files.cover[0].path, publicId: req.files.cover[0].filename };
  }
  if (req.files?.gallery?.length) {
    payload.gallery = [
      ...project.gallery,
      ...req.files.gallery.map((f) => ({ url: f.path, publicId: f.filename })),
    ];
  }

  Object.assign(project, payload);
  await project.save();
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "That project isn't here." });

  await destroyImage(project.cover?.publicId);
  await Promise.all(project.gallery.map((img) => destroyImage(img.publicId)));
  await project.deleteOne();

  res.json({ message: "Project deleted." });
};
