import React, { useState } from 'react';
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Table from "@/components/shared/table/Table";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import { useServices, useServiceMutations } from "../hooks/useServices";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";

export default function ListServices() {
    const { services, isLoading } = useServices();
    const { remove } = useServiceMutations();
    const { isSuperAdmin } = useAuth();
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = () => {
        if (deleteId) {
            remove(deleteId);
            setDeleteId(null);
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <PageTransition>
            <PageContainer>
                <PageHeader
                    title="Services"
                    description="Manage your service offerings."
                    actions={
                        <Link to="/cms/services/new">
                            <RestrictedButton title="Superadmins only">
                                <Plus className="mr-2 h-4 w-4" /> Create Service
                            </RestrictedButton>
                        </Link>
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No services found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service._id}>
                                        <TableCell>
                                            {service.image?.url && (
                                                <img
                                                    src={service.image.url}
                                                    alt={service.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {service.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-md">
                                            {truncateText(service.description)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {service.price ? `₹${service.price}` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link
                                                    to={`/cms/services/${service._id}/edit`}
                                                    state={{ service }}
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
                                                        onClick={() => setDeleteId(service._id)}
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
                    title="Delete Service?"
                    description="This action cannot be undone. This will permanently delete the service."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                />
            </PageContainer>
        </PageTransition>
    );
}
