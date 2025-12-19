import { adminClient } from "@/lib/api/adminClient";
import { publicClient } from "@/lib/api/publicClient";

// Public Routes (Reading) - Can use adminClient for simplicity in CMS
export const fetchProjects = async () => {
    const response = await publicClient.get("/projects");
    return response.data;
};

export const fetchProjectById = async (id) => {
    const response = await publicClient.get(`/projects/${id}`);
    return response.data;
};

// Admin Routes (Writing)
export const createProject = async (projectData) => {
    const response = await adminClient.post("/projects", projectData);
    return response.data;
};

export const updateProject = async (id, projectData) => {
    const response = await adminClient.put(`/projects/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await adminClient.delete(`/projects/${id}`);
    return response.data;
};
