import { useParams } from "react-router-dom";
import { useExperience, useExperienceMutations } from "../hooks/useExperience";
import ExperienceForm from "../components/ExperienceForm";
import PageContainer from "@/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditExperience() {
    const { id } = useParams();
    const { experience, isLoading, isError } = useExperience(id);
    const { update } = useExperienceMutations();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !experience) {
        return (
            <div className="flex h-screen items-center justify-center text-destructive">
                Failed to load experience
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <ExperienceForm
                    initialData={experience}
                    onSubmit={(data) => update(id, data)}
                    isEditing
                />
            </PageContainer>
        </PageTransition>
    );
}
