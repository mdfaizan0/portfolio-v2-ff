import { publicClient } from "@/lib/api/publicClient";
import { adminClient } from "@/lib/api/adminClient";

export const fetchServices = async () => {
    const response = await publicClient.get("/services");
    return response.data;
};

export const fetchServiceById = async (id) => {
    const response = await publicClient.get(`/services/id/${id}`);
    return response.data;
};

export const createService = async (data) => {
    const response = await adminClient.post("/services", data);
    return response.data;
};

export const updateService = async (id, data) => {
    const response = await adminClient.put(`/services/${id}`, data);
    return response.data;
};

export const deleteService = async (id) => {
    const response = await adminClient.delete(`/services/${id}`);
    return response.data;
};
