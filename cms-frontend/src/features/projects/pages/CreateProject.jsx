import React from 'react';
import ProjectForm from "../components/ProjectForm";
import PageContainer from "@/components/layout/PageContainer";
import { useProjectMutations } from "../hooks/useProjects";
import PageTransition from "@/components/shared/PageTransition";

export default function CreateProject() {
    const { create } = useProjectMutations();

    return (
        <PageTransition>
            <PageContainer>
                <ProjectForm onSubmit={create} />
            </PageContainer>
        </PageTransition>
    );
}
