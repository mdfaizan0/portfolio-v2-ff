import Blog from "../models/Blog.js"
import { convertToExcerpt, convertToSlug } from "../utils/convertBlogContent.js"
import { handleStorageDelete, signURL } from "../utils/supabaseHandler.js"

const EXCERPT_LENGTH = 150

export const fetchBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean()
        await Promise.all(blogs.map(async blog => {
            blog.coverImage = {
                path: blog.coverImage,
                url: await signURL(blog.coverImage)
            }
        }))
        res.status(200).json({ success: true, count: blogs.length, data: blogs })
    } catch (error) {
        console.error("Error fetching blogs:", error)
        res.status(500).json({ success: false, message: "Server error while fetching blogs" })
    }
}

export const fetchBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean()
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        // Handle markdownContent if array (legacy/schema quirk)
        if (Array.isArray(blog.markdownContent)) {
            blog.markdownContent = blog.markdownContent.join('\n');
        }

        blog.coverImage = {
            path: blog.coverImage,
            url: await signURL(blog.coverImage) // Original quality for edit
        }
        res.status(200).json({ success: true, data: blog })
    } catch (error) {
        console.error("Error fetching blog by ID:", error)
        res.status(500).json({ success: false, message: "Server error while fetching blog" })
    }
}

export const fetchBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug }).lean()
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }
        blog.coverImage = {
            path: blog.coverImage,
            url: await signURL(blog.coverImage)
        }
        res.status(200).json({ success: true, data: blog })
    } catch (error) {
        console.error("Error fetching blog:", error)
        res.status(500).json({ success: false, message: "Server error while fetching blog" })
    }
}

export const createBlog = async (req, res) => {
    const { title, coverImage, markdownContent } = req.body

    if (!title || !coverImage || !markdownContent) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
        let slug = convertToSlug(title)

        const existing = await Blog.findOne({ slug })
        if (existing) {
            slug = convertToSlug(title + "-" + Date.now())
        }

        const excerpt = convertToExcerpt(markdownContent, EXCERPT_LENGTH)

        const blog = await Blog.create({
            title,
            coverImage,
            markdownContent,
            slug,
            excerpt
        })
        res.status(201).json({ success: true, data: blog })
    } catch (error) {
        console.error("Error creating blog:", error)
        res.status(500).json({ success: false, message: "Server error while creating blog" })
    }
}

export const updateBlog = async (req, res) => {
    const { id } = req.params
    const { title, coverImage, markdownContent } = req.body

    if (title === undefined && coverImage === undefined && markdownContent === undefined) {
        return res.status(400).json({ success: false, message: "At least one field is required" })
    }

    try {
        let updateData = {}
        let slug

        if (title !== undefined) {
            slug = convertToSlug(title)
            const exists = await Blog.findOne({ slug, _id: { $ne: id } })
            if (exists) slug = convertToSlug(title + "-" + Date.now())
            updateData.title = title
            updateData.slug = slug
        }

        if (markdownContent !== undefined) {
            updateData.markdownContent = markdownContent
            updateData.excerpt = convertToExcerpt(markdownContent, EXCERPT_LENGTH)
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "At least one field required" })
        }

        if (coverImage !== undefined) {
            const oldBlog = await Blog.findById(id);
            if (oldBlog.coverImage !== coverImage) {
                await handleStorageDelete(oldBlog.coverImage);
            }
            updateData.coverImage = coverImage;
        }

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true })
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        res.status(200).json({ success: true, data: blog })
    } catch (error) {
        console.error("Error updating blog:", error)
        res.status(500).json({ success: false, message: "Server error while updating blog" })
    }
}

export const deleteBlog = async (req, res) => {
    const { id } = req.params
    try {
        const blog = await Blog.findByIdAndDelete(id)
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }
        if (blog.coverImage) await handleStorageDelete(blog.coverImage)
        res.status(200).json({ success: true, message: "Blog deleted successfully" })
    } catch (error) {
        console.error("Error deleting blog:", error)
        res.status(500).json({ success: false, message: "Server error while deleting blog" })
    }
}
