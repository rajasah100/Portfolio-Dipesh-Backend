import Skill from "../models/Skill.js";
import { destroyImage } from "../config/cloudinary.js";

// GET /api/skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ group: 1, order: 1 });

    res.status(200).json(skills);
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

// POST /api/skills
export const createSkill = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const skillData = {
      name: req.body.name,
      group: req.body.group || "other",
      level: Number(req.body.level) || 70,
      order: Number(req.body.order) || 0,
    };

    if (req.file) {
      skillData.icon = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const skill = await Skill.create(skillData);

    res.status(201).json(skill);
  } catch (error) {
    console.error("CREATE SKILL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/skills/:id
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    const { name, group, order, level, description } = req.body;

    if (name !== undefined) skill.name = name.trim();
    if (group !== undefined) skill.group = group;
    if (order !== undefined) skill.order = Number(order);
    if (level !== undefined) skill.level = level;
    if (description !== undefined) skill.description = description;

    // If new image is uploaded
    if (req.file) {
      // Delete old Cloudinary image
      if (skill.icon?.publicId) {
        await destroyImage(skill.icon.publicId);
      }

      skill.icon = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("UPDATE SKILL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update skill",
      error: error.message,
    });
  }
};

// DELETE /api/skills/:id
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    // Delete Cloudinary image
    if (skill.icon?.publicId) {
      await destroyImage(skill.icon.publicId);
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};

// POST /api/skills/icon
export const upsertSkillIcon = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Skill name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const skillName = name.trim();

    let skill = await Skill.findOne({
      name: skillName,
    });

    if (skill) {
      // Delete old image
      if (skill.icon?.publicId) {
        await destroyImage(skill.icon.publicId);
      }

      skill.icon = {
        url: req.file.path,
        publicId: req.file.filename,
      };

      await skill.save();
    } else {
      skill = await Skill.create({
        name: skillName,
        icon: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Skill icon uploaded successfully",
      skill,
    });
  } catch (error) {
    console.error("UPSERT SKILL ICON ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload skill icon",
      error: error.message,
    });
  }
};