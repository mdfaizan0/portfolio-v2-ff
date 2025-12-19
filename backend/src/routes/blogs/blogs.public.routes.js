import express from "express";
import { fetchBlogs, fetchBlog, fetchBlogById } from "../../controllers/blogs.controller.js";

const router = express.Router();

router.get("/", fetchBlogs);
router.get("/:slug", fetchBlog);
router.get("/id/:id", fetchBlogById);

export default router;
