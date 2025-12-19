import express from "express";
import { fetchExperience, getExperienceById } from "../../controllers/experience.controller.js";

const router = express.Router();

router.get("/", fetchExperience);
router.get("/:id", getExperienceById);

export default router;
