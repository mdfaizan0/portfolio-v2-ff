import { adminClient } from "@/lib/api/adminClient";
import { publicClient } from "@/lib/api/publicClient";

// Public Routes (Reading)
export const fetchExperience = async () => {
    const response = await publicClient.get("/experience");
    return response.data;
};

export const fetchExperienceById = async (id) => {
    const response = await publicClient.get(`/experience/${id}`);
    return response.data;
};

// Admin Routes (Writing)
export const createExperience = async (data) => {
    const response = await adminClient.post("/experience", data);
    return response.data;
};

export const updateExperience = async (id, data) => {
    const response = await adminClient.put(`/experience/${id}`, data);
    return response.data;
};

export const deleteExperience = async (id) => {
    const response = await adminClient.delete(`/experience/${id}`);
    return response.data;
};
