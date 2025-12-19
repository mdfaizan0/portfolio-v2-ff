import express from "express";
import { createExperience, updateExperience, deleteExperience } from "../../controllers/experience.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createExperience);
router.put("/:id", protect, isSuper, updateExperience);
router.delete("/:id", protect, isSuper, deleteExperience);

export default router;
