import { useState } from "react";
import { useExperienceList, useExperienceMutations } from "../hooks/useExperience";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Table from "@/components/shared/table/Table";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { RestrictedButton } from "@/components/shared/Restricted";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";

const formatDate = (dateString, isEndDate) => {
    if (!dateString && isEndDate) return "Present";
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short'
    });
};

export default function ListExperience() {
    const { experience, isLoading, isError } = useExperienceList();
    const { remove } = useExperienceMutations();
    const { isSuperAdmin } = useAuth();

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            remove(deleteId);
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen items-center justify-center text-destructive">
                Failed to load experience
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <PageHeader
                    title="Experience"
                    description="Manage your work history."
                    actions={
                        <Link to="/cms/experience/new">
                            <RestrictedButton title="Superadmins only">
                                <Plus className="mr-2 h-4 w-4" /> Add Experience
                            </RestrictedButton>
                        </Link>
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Timeline</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experience.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No experience entries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                experience.map((exp) => (
                                    <TableRow key={exp._id}>
                                        <TableCell className="font-medium">{exp.role}</TableCell>
                                        <TableCell>{exp.company}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate, true)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/cms/experience/${exp._id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {isSuperAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteClick(exp._id)}
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
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    title="Delete Experience"
                    description="Are you sure you want to delete this experience entry? This action cannot be undone."
                    destructive
                />
            </PageContainer>
        </PageTransition>
    );
}
