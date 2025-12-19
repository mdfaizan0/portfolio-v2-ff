import { useTestimonialMutations } from "../hooks/useTestimonials";
import TestimonialForm from "../components/TestimonialForm";
import PageContainer from "@/components/layout/PageContainer";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateTestimonial() {
    const { create } = useTestimonialMutations();

    return (
        <PageTransition>
            <PageContainer>
                <TestimonialForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
