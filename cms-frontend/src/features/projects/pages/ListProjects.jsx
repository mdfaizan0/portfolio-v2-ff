import React, { useState } from 'react';
import { useProjects, useProjectMutations } from "../hooks/useProjects";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Table from "@/components/shared/table/Table";
import TableHeader from "@/components/shared/table/TableHeader";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/shared/PageTransition";

export default function ListProjects() {
    const { projects, isLoading, isError } = useProjects();
    const { remove } = useProjectMutations();
    const { isSuperAdmin } = useAuth();

    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = () => {
        if (deleteId) {
            remove(deleteId);
            setDeleteId(null);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </PageContainer>
        );
    }

    if (isError) {
        return (
            <PageContainer>
                <div className="text-red-500">Failed to load projects.</div>
            </PageContainer>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <PageHeader
                    title="Projects"
                    description="Manage your portfolio projects."
                    actions={
                        isSuperAdmin ? (
                            <Link to="/cms/projects/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" /> Create Project
                                </Button>
                            </Link>
                        ) : (
                            <Button disabled title="Superadmin only">
                                <Plus className="w-4 h-4 mr-2" /> Create Project
                            </Button>
                        )
                    }
                />

                <Table>
                    <TableHeader columns={["Title", "Tech Stack", "Featured", "Actions"]} />
                    <tbody>
                        {projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                                    No projects found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {project.thumbnail?.url && (
                                                <img
                                                    src={project.thumbnail.url}
                                                    alt=""
                                                    className="w-10 h-10 rounded object-cover border"
                                                />
                                            )}
                                            {project.title}
                                        </div>
                                    </TableCell>
                                    <TableCell truncate className="max-w-[200px]">
                                        {Array.isArray(project.technologies)
                                            ? project.technologies.join(", ")
                                            : project.technologies}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs border",
                                            project.featured
                                                ? "bg-primary/10 text-primary border-primary/20"
                                                : "bg-muted text-muted-foreground border-transparent"
                                        )}>
                                            {project.featured ? "Featured" : "Standard"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link to={`/cms/projects/${project._id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            {isSuperAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeleteId(project._id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </tbody>
                </Table>

                <ConfirmDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Delete Project?"
                    description="This action cannot be undone. It will permanently delete the project and its images."
                    confirmLabel="Delete Project"
                    destructive
                    onConfirm={handleDelete}
                />
            </PageContainer>
        </PageTransition>
    );
}
