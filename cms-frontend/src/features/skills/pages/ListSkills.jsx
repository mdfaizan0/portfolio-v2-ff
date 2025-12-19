import React, { useState } from 'react';
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Table from "@/components/shared/table/Table";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import { useSkills, useSkillMutations } from "../hooks/useSkills";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SkillIcon from "../components/SkillIcon";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";

export default function ListSkills() {
    const { skills, isLoading } = useSkills();
    const { remove } = useSkillMutations();
    const { isSuperAdmin } = useAuth();
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = () => {
        if (deleteId) {
            remove(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <PageTransition>
            <PageContainer>
                <PageHeader
                    title="Skills"
                    description="Manage your technical skills."
                    actions={
                        <Link to="/cms/skills/new">
                            <RestrictedButton title="Superadmins only">
                                <Plus className="mr-2 h-4 w-4" /> Create Skill
                            </RestrictedButton>
                        </Link>
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Icon</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : skills.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No skills found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                skills.map((skill) => (
                                    <TableRow key={skill._id}>
                                        <TableCell>
                                            <SkillIcon
                                                skillName={skill.name}
                                                className="w-6 h-6"
                                                useBrandColor={true}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {skill.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link
                                                    to={`/cms/skills/${skill._id}/edit`}
                                                    state={{ skill }}
                                                >
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {isSuperAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setDeleteId(skill._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>

                <ConfirmDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Delete Skill?"
                    description="This action cannot be undone. This will permanently delete the skill."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                />
            </PageContainer>
        </PageTransition>
    );
}
