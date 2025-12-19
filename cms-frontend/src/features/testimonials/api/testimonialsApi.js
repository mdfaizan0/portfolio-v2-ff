import { adminClient } from "@/lib/api/adminClient";
import { publicClient } from "@/lib/api/publicClient";

// Public Routes (Reading)
export const fetchTestimonials = async () => {
    const response = await publicClient.get("/testimonials");
    return response.data;
};

export const fetchTestimonialById = async (id) => {
    const response = await publicClient.get(`/testimonials/${id}`);
    return response.data;
};

// Admin Routes (Writing)
export const createTestimonial = async (data) => {
    const response = await adminClient.post("/testimonials", data);
    return response.data;
};

export const updateTestimonial = async (id, data) => {
    const response = await adminClient.put(`/testimonials/${id}`, data);
    return response.data;
};

export const deleteTestimonial = async (id) => {
    const response = await adminClient.delete(`/testimonials/${id}`);
    return response.data;
};
