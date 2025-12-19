import express from "express";
import { createAbout, updateAbout, deleteAbout } from "../../controllers/about.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createAbout);
router.put("/", protect, isSuper, updateAbout);
router.delete("/", protect, isSuper, deleteAbout);

export default router;
