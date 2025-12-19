import useSWR, { mutate } from "swr";
import { fetchServices, fetchServiceById, createService, updateService, deleteService } from "../api/servicesApi";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/toast/notify";

// Fetch all services
export function useServices() {
    const { data, error, isLoading } = useSWR("/services", fetchServices);
    return {
        services: data || [],
        isLoading,
        isError: error
    };
}

// Fetch single service
export function useService(id) {
    const { data, error, isLoading } = useSWR(
        id ? `/services/id/${id}` : null,
        () => fetchServiceById(id)
    );
    return {
        service: data,
        isLoading,
        isError: error
    };
}

// Mutations
export function useServiceMutations() {
    const navigate = useNavigate();

    const create = async (data) => {
        try {
            await createService(data);
            notify("Service created successfully", "success");
            mutate("/services");
            navigate("/cms/services");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to create service", "error");
        }
    };

    const update = async (id, data) => {
        try {
            await updateService(id, data);
            notify("Service updated successfully", "success");
            mutate("/services");
            mutate(`/services/id/${id}`);
            navigate("/cms/services");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to update service", "error");
        }
    };

    const remove = async (id) => {
        try {
            await deleteService(id);
            notify("Service deleted successfully", "success");
            mutate("/services");
        } catch (error) {
            notify(error.response?.data?.message || "Failed to delete service", "error");
        }
    };

    return { create, update, remove };
}
