import express from "express";
import { createBlog, updateBlog, deleteBlog } from "../../controllers/blogs.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createBlog);
router.put("/:id", protect, isSuper, updateBlog);
router.delete("/:id", protect, isSuper, deleteBlog);

export default router;
