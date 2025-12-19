import { useParams } from "react-router-dom";
import { useTestimonial, useTestimonialMutations } from "../hooks/useTestimonials";
import TestimonialForm from "../components/TestimonialForm";
import PageContainer from "@/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditTestimonial() {
    const { id } = useParams();
    const { testimonial, isLoading, isError } = useTestimonial(id);
    const { update } = useTestimonialMutations();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !testimonial) {
        return (
            <div className="flex h-screen items-center justify-center text-destructive">
                Failed to load testimonial
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <TestimonialForm
                    initialData={testimonial}
                    onSubmit={(data) => update(id, data)}
                    isEditing
                />
            </PageContainer>
        </PageTransition>
    );
}
