import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Skill from "./models/Skill.js";
import Profile from "./models/Profile.js";
import Experience from "./models/Experience.js";

dotenv.config();

const profile = {
  key: "main",
  name: "Dipesh Mahato",
  roles: ["Full-Stack Developer", "MERN Specialist", "React & Node Developer"],
  badge: "Available for freelance & full-time",
  tagline:
    "I build modern, scalable and user-friendly web applications — from the interface people touch to the API and database underneath. Based in Nepal, working with teams anywhere.",
  aboutTitle: "Turning ideas into working products",
  aboutParagraphs: [
    "I started with a stubborn CSS bug and never really stopped. Most of what I build now sits between a clean interface and a database that has to stay honest.",
    "I work end to end: designing the data model, writing the API, building the interface, and handling the parts nobody notices until they break.",
  ],
  floatCards: [
    { value: "3+", label: "Years experience" },
    { value: "MERN", label: "Full-stack" },
  ],
  stats: [
    { value: 15, label: "Projects shipped" },
    { value: 3, label: "Years building" },
    { value: 12, label: "Happy clients" },
    { value: 20, label: "Technologies" },
  ],
  email: "hello@dipeshmahato.com",
  phone: "+977 98-XXXXXXXX",
  location: "Nepal — working remotely",
  responseTime: "Usually within 24 hours",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
};

const experience = [
  { role: "Freelance Full-Stack Developer", company: "Self-employed · Remote", period: "2025 — Present", order: 0,
    description: "Building web applications end to end for clients in Nepal and abroad — from requirements through to deployment and handover." },
  { role: "Co-founder & Developer", company: "Tayari Academy", period: "2024 — 2025", order: 1,
    description: "Built and run an online exam-prep platform: question banks, timed mock tests and student analytics." },
  { role: "Web Developer", company: "Leo Tech Solutions", period: "2023 — 2024", order: 2,
    description: "Delivered company and campus websites with custom admin panels, so non-technical owners could publish content themselves." },
];

const skills = [
  { name: "React", group: "frontend", level: 92, order: 1 },
  { name: "Tailwind CSS", group: "frontend", level: 90, order: 2 },
  { name: "Framer Motion", group: "frontend", level: 82, order: 3 },
  { name: "Node.js", group: "backend", level: 88, order: 1 },
  { name: "Express", group: "backend", level: 86, order: 2 },
  { name: "MongoDB", group: "database", level: 84, order: 1 },
  { name: "Mongoose", group: "database", level: 82, order: 2 },
  { name: "Cloudinary", group: "tools", level: 80, order: 1 },
  { name: "Git & GitHub", group: "tools", level: 85, order: 2 },
];

const projects = [
  {
    title: "Surakshya",
    summary: "A family safety app that keeps parents and students connected during the school run.",
    description:
      "Live location sharing, an SOS button that reaches three guardians at once, and a trip history parents can scroll through. Built with Flutter on the front and a Node service behind it.",
    stack: ["Flutter", "Node.js", "MongoDB", "Firebase"],
    category: "mobile",
    year: 2025,
    featured: true,
    order: 1,
  },
  {
    title: "Tayari Academy",
    summary: "Exam-prep platform with timed mock tests and per-question analytics.",
    description:
      "Students sit full-length mocks, get an instant breakdown by subject, and can revisit every question they missed. Serves a growing cohort of medical licensing candidates.",
    stack: ["React", "Express", "MongoDB", "Tailwind CSS"],
    category: "web",
    year: 2025,
    featured: true,
    order: 2,
  },
  {
    title: "Leo Tech Solutions",
    summary: "Company site with a client dashboard behind a login.",
    description:
      "Marketing pages for visitors, and a private area where clients track project progress, invoices and support tickets.",
    stack: ["MERN", "JWT", "Cloudinary"],
    category: "web",
    year: 2024,
    featured: true,
    order: 3,
  },
];

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(), Project.deleteMany(), Skill.deleteMany(),
    Profile.deleteMany(), Experience.deleteMany(),
  ]);

  await User.create({
    name: "Dipesh Mahato",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  await Skill.insertMany(skills);
  await Project.insertMany(projects);
  await Experience.insertMany(experience);
  await Profile.create(profile);

  console.log("Seeded admin user, profile, skills, projects and experience.");
  await mongoose.connection.close();
};

run();