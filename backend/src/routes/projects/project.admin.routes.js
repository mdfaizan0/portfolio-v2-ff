import express from "express";
import { createProject, updateProject, deleteProject } from "../../controllers/projects.controller.js";
import { isSuper, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createProject);
router.put("/:id", protect, isSuper, updateProject);
router.delete("/:id", protect, isSuper, deleteProject);

export default router;