import PageContainer from "@/components/layout/PageContainer";
import SkillForm from "../components/SkillForm";
import { useSkillMutations } from "../hooks/useSkills";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateSkill() {
    const { create } = useSkillMutations();

    return (
        <PageTransition>
            <PageContainer>
                <SkillForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
