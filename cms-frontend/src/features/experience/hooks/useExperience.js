import useSWR, { mutate } from "swr";
import {
    fetchExperience,
    fetchExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} from "../api/experienceApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch List
export function useExperienceList() {
    const { data, error, isLoading } = useSWR("/experience", fetchExperience);
    return {
        experience: data || [],
        isLoading,
        isError: error,
    };
}

// Fetch Single
export function useExperience(id) {
    const { data, error, isLoading } = useSWR(id ? `/experience/${id}` : null, () => fetchExperienceById(id));
    return {
        experience: data || null,
        isLoading,
        isError: error,
    };
}

// Mutations
export function useExperienceMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createExperience(data);
            notify("Experience created successfully", "success");
            mutate("/experience");
            navigate("/cms/experience");
        } catch (error) {
            console.error("Create failed", error);
            notify(error.response?.data?.message || "Failed to create experience", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateExperience(id, data);
            notify("Experience updated successfully", "success");
            mutate("/experience"); // Refresh list
            mutate(`/experience/${id}`); // Refresh single item
            navigate("/cms/experience");
        } catch (error) {
            console.error("Update failed", error);
            notify(error.response?.data?.message || "Failed to update experience", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteExperience(id);
            notify("Experience deleted successfully", "success");
            mutate("/experience");
        } catch (error) {
            console.error("Delete failed", error);
            notify(error.response?.data?.message || "Failed to delete experience", "error");
        }
    };

    return { create, update, remove };
}
