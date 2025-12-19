import express from "express";
import { fetchTestimonials, getTestimonialById } from "../../controllers/testimonials.controller.js";

const router = express.Router();

router.get("/", fetchTestimonials);
router.get("/:id", getTestimonialById);

export default router;
