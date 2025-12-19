import express from "express";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "../../controllers/testimonials.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createTestimonial);
router.put("/:id", protect, isSuper, updateTestimonial);
router.delete("/:id", protect, isSuper, deleteTestimonial);

export default router;
