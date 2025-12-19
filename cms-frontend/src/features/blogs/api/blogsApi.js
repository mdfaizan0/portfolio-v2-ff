import { adminClient } from "@/lib/api/adminClient";
import { publicClient } from "@/lib/api/publicClient";

// Public Routes (Reading)
export const fetchBlogs = async () => {
    const response = await publicClient.get("/blogs");
    return response.data;
};

export const fetchBlogById = async (id) => {
    const response = await publicClient.get(`/blogs/id/${id}`);
    return response.data;
};

export const fetchBlogBySlug = async (slug) => {
    const response = await publicClient.get(`/blogs/${slug}`);
    return response.data;
};

// Admin Routes (Writing & Single ID fetch for edit)
export const createBlog = async (blogData) => {
    const response = await adminClient.post("/blogs", blogData);
    return response.data;
};

export const updateBlog = async (id, blogData) => {
    const response = await adminClient.put(`/blogs/${id}`, blogData);
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await adminClient.delete(`/blogs/${id}`);
    return response.data;
};
