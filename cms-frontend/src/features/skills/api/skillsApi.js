import { publicClient } from "@/lib/api/publicClient";
import { adminClient } from "@/lib/api/adminClient";

export const fetchSkills = async () => {
    const response = await publicClient.get("/skills");
    return response.data;
};

export const createSkill = async (data) => {
    const response = await adminClient.post("/skills", data);
    return response.data;
};

export const updateSkill = async (id, data) => {
    const response = await adminClient.put(`/skills/${id}`, data);
    return response.data;
};

export const deleteSkill = async (id) => {
    const response = await adminClient.delete(`/skills/${id}`);
    return response.data;
};
