import useSWR, { mutate } from "swr";
import { fetchBlogs, fetchBlogById, createBlog, updateBlog, deleteBlog } from "../api/blogsApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch List
export function useBlogs() {
    const { data, error, isLoading } = useSWR("/blogs", fetchBlogs, {
        revalidateOnFocus: false, // Prevent refetch on window focus
        dedupingInterval: 5000,
    });
    return {
        blogs: data || [],
        isLoading,
        isError: error,
    };
}

// Fetch Single (Admin/Edit context)
export function useBlog(id) {
    const { data, error, isLoading } = useSWR(id ? `/blogs/id/${id}` : null, () => fetchBlogById(id), {
        revalidateOnFocus: false,
    });
    return {
        blog: data || {},
        isLoading,
        isError: error,
    };
}

// Mutations
export function useBlogMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createBlog(data);
            notify("Blog created successfully", "success");
            mutate("/blogs"); // Refresh list
            navigate("/cms/blogs");
        } catch (error) {
            console.error("Create failed", error);
            notify(error.response?.data?.message || "Failed to create blog", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateBlog(id, data);
            notify("Blog updated successfully", "success");
            mutate("/blogs"); // Refresh list
            mutate(`/blogs/${id}`); // Refresh single
            navigate("/cms/blogs");
        } catch (error) {
            console.error("Update failed", error);
            notify(error.response?.data?.message || "Failed to update blog", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteBlog(id);
            notify("Blog deleted successfully", "success");
            mutate("/blogs"); // Refresh list
        } catch (error) {
            console.error("Delete failed", error);
            notify(error.response?.data?.message || "Failed to delete blog", "error");
        }
    };

    return { create, update, remove };
}
