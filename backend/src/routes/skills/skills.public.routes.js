import express from "express";
import { fetchSkills } from "../../controllers/skills.controller.js";

const router = express.Router();

router.get("/", fetchSkills);

export default router;
