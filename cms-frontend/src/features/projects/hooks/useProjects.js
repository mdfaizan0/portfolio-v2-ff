import useSWR, { mutate } from "swr";
import { fetchProjects, fetchProjectById, createProject, updateProject, deleteProject } from "../api/projectsApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch List
export function useProjects() {
    const { data, error, isLoading } = useSWR("/projects", fetchProjects, {
        revalidateOnFocus: false, // Prevent refetch on window focus
        dedupingInterval: 5000, // Debounce requests within 5s
    });
    return {
        projects: data || [],
        isLoading,
        isError: error,
    };
}

// Fetch Single
export function useProject(id) {
    const { data, error, isLoading } = useSWR(id ? `/projects/${id}` : null, () => fetchProjectById(id), {
        revalidateOnFocus: false,
    });
    return {
        project: data || {},
        isLoading,
        isError: error,
    };
}

// Mutations
export function useProjectMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createProject(data);
            notify("Project created successfully", "success");
            mutate("/projects"); // Refresh list
            navigate("/cms/projects");
        } catch (error) {
            console.error("Create failed", error);
            notify(error.response?.data?.message || "Failed to create project", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateProject(id, data);
            notify("Project updated successfully", "success");
            mutate("/projects"); // Refresh list
            mutate(`/projects/${id}`); // Refresh single
            navigate("/cms/projects"); // or stay? Plan said reasonable default. List is safe.
        } catch (error) {
            console.error("Update failed", error);
            notify(error.response?.data?.message || "Failed to update project", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteProject(id);
            notify("Project deleted successfully", "success");
            mutate("/projects"); // Refresh list
        } catch (error) {
            console.error("Delete failed", error);
            notify(error.response?.data?.message || "Failed to delete project", "error");
        }
    };

    return { create, update, remove };
}
