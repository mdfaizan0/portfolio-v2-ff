import { useParams, useLocation } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SkillForm from "../components/SkillForm";
import { useSkills, useSkillMutations } from "../hooks/useSkills";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditSkill() {
    const { id } = useParams();
    const location = useLocation();
    const { update } = useSkillMutations();

    // Try to get skill from route state first
    const skillFromState = location.state?.skill;

    // If no state, fetch all skills and find by ID
    const { skills, isLoading } = useSkills();
    const skill = skillFromState || skills.find(s => s._id === id);

    if (isLoading && !skillFromState) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="text-center py-20 text-destructive">
                Skill not found.
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <SkillForm
                    initialData={skill}
                    onSubmit={(data) => update(id, data)}
                    isEditing
                />
            </PageContainer>
        </PageTransition>
    );
}
