import useSWR, { mutate } from "swr";
import { fetchAbout, createAbout, updateAbout, deleteAbout } from "../api/aboutApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch Single (About is singleton)
export function useAbout() {
    const { data, error, isLoading } = useSWR("/about", fetchAbout, {
        revalidateOnFocus: false,
    });
    return {
        about: data || null, // Accessing data.data based on controller response structure
        isLoading,
        isError: error,
    };
}

// Mutations
export function useAboutMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createAbout(data);
            notify("About information created successfully", "success");
            mutate("/about"); // Refresh fetch
            navigate("/cms/about");
        } catch (error) {
            console.error("Create failed", error);
            notify(error.response?.data?.message || "Failed to create about information", "error");
        }
    };

    const update = async (data) => {
        try {
            await updateAbout(data);
            notify("About information updated successfully", "success");
            mutate("/about"); // Refresh fetch
            navigate("/cms/about");
        } catch (error) {
            console.error("Update failed", error);
            notify(error.response?.data?.message || "Failed to update about information", "error");
        }
    };

    const remove = async () => {
        try {
            await deleteAbout();
            notify("About information deleted successfully", "success");
            mutate("/about"); // Refresh fetch to show empty state
            navigate("/cms/about");
        } catch (error) {
            console.error("Delete failed", error);
            notify(error.response?.data?.message || "Failed to delete about information", "error");
        }
    };

    return { create, update, remove };
}
