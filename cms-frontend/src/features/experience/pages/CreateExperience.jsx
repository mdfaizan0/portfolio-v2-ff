import { useExperienceMutations } from "../hooks/useExperience";
import ExperienceForm from "../components/ExperienceForm";
import PageContainer from "@/components/layout/PageContainer";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateExperience() {
    const { create } = useExperienceMutations();

    return (
        <PageTransition>
            <PageContainer>
                <ExperienceForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
