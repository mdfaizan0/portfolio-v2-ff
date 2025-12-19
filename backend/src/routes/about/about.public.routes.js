import express from "express";
import { fetchAbout } from "../../controllers/about.controller.js";

const router = express.Router();

router.get("/", fetchAbout);

export default router;
