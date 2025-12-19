import express from "express";
import { createSkill, updateSkill, deleteSkill } from "../../controllers/skills.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createSkill);
router.put("/:id", protect, isSuper, updateSkill);
router.delete("/:id", protect, isSuper, deleteSkill);

export default router;
