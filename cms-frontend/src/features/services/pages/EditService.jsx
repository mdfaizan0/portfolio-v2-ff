import { useParams, useLocation } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import ServiceForm from "../components/ServiceForm";
import { useServices, useServiceMutations } from "../hooks/useServices";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditService() {
    const { id } = useParams();
    const location = useLocation();
    const { update } = useServiceMutations();

    // Try to get service from route state first
    const serviceFromState = location.state?.service;

    // If no state, fetch all services and find by ID
    const { services, isLoading } = useServices();
    const service = serviceFromState || services.find(s => s._id === id);

    if (isLoading && !serviceFromState) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center py-20 text-destructive">
                Service not found.
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <ServiceForm
                    initialData={service}
                    onSubmit={(data) => update(id, data)}
                    isEditing
                />
            </PageContainer>
        </PageTransition>
    );
}
