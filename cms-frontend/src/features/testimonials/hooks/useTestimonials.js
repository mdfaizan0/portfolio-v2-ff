import useSWR, { mutate } from "swr";
import {
    fetchTestimonials,
    fetchTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from "../api/testimonialsApi";
import { notify } from "@/lib/toast/notify";
import { useNavigate } from "react-router-dom";

// Fetch List
export function useTestimonials() {
    const { data, error, isLoading } = useSWR("/testimonials", fetchTestimonials);
    return {
        testimonials: data || [],
        isLoading,
        isError: error,
    };
}

// Fetch Single
export function useTestimonial(id) {
    const { data, error, isLoading } = useSWR(id ? `/testimonials/${id}` : null, () => fetchTestimonialById(id));
    return {
        testimonial: data || null,
        isLoading,
        isError: error,
    };
}

// Mutations
export function useTestimonialMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createTestimonial(data);
            notify("Testimonial created successfully", "success");
            mutate("/testimonials");
            navigate("/cms/testimonials");
        } catch (error) {
            console.error("Create failed", error);
            notify(error.response?.data?.message || "Failed to create testimonial", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateTestimonial(id, data);
            notify("Testimonial updated successfully", "success");
            mutate("/testimonials"); // Refresh list
            mutate(`/testimonials/${id}`); // Refresh single item
            navigate("/cms/testimonials");
        } catch (error) {
            console.error("Update failed", error);
            notify(error.response?.data?.message || "Failed to update testimonial", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteTestimonial(id);
            notify("Testimonial deleted successfully", "success");
            mutate("/testimonials");
        } catch (error) {
            console.error("Delete failed", error);
            notify(error.response?.data?.message || "Failed to delete testimonial", "error");
        }
    };

    return { create, update, remove };
}
