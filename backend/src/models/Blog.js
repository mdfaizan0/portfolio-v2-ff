import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true
    },
    markdownContent: {
        type: [String],
        required: true
    },
    excerpt: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Blog = mongoose.model("Blog", blogSchema)

export default Blog