import { useState } from "react";
import { useTestimonials, useTestimonialMutations } from "../hooks/useTestimonials";
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

export default function ListTestimonials() {
    const { testimonials, isLoading, isError } = useTestimonials();
    const { remove } = useTestimonialMutations();
    const { isSuperAdmin } = useAuth();

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setTestimonialToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (testimonialToDelete) {
            remove(testimonialToDelete);
            setIsDeleteDialogOpen(false);
            setTestimonialToDelete(null);
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
                Failed to load testimonials
            </div>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                <PageHeader
                    title="Testimonials"
                    description="Manage client feedback and reviews."
                    actions={
                        <Link to="/cms/testimonials/new">
                            <RestrictedButton title="Superadmins only">
                                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                            </RestrictedButton>
                        </Link>
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Avatar</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quote</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No testimonials found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                testimonials.map((t) => (
                                    <TableRow key={t._id}>
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted relative">
                                                {t.avatar?.url ? (
                                                    <img
                                                        src={t.avatar.url}
                                                        alt={t.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground uppercase">
                                                        {t.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{t.name}</div>
                                            {t.designation && (
                                                <div className="text-xs text-muted-foreground">{t.designation}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate text-muted-foreground">
                                            "{t.quote}"
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/cms/testimonials/${t._id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {isSuperAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteClick(t._id)}
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
                    title="Delete Testimonial"
                    description="Are you sure you want to delete this testimonial? This action cannot be undone."
                    destructive
                />
            </PageContainer>
        </PageTransition>
    );
}
