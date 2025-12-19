import React from 'react';
import ProjectForm from "../components/ProjectForm";
import PageContainer from "@/components/layout/PageContainer";
import { useProject, useProjectMutations } from "../hooks/useProjects";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

export default function EditProject() {
    const { id } = useParams();
    const { project, isLoading, isError } = useProject(id);
    const { update } = useProjectMutations();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !project) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">Project not found</div>
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <ProjectForm
                    initialData={project}
                    onSubmit={(data) => update(id, data)}
                    isEditing
                />
            </PageContainer>
        </PageTransition>
    );
}
