import React, { useState } from 'react';
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Table from "@/components/shared/table/Table";
import TableHeader from "@/components/shared/table/TableHeader";
import TableRow from "@/components/shared/table/TableRow";
import TableCell from "@/components/shared/table/TableCell";
import { useBlogs, useBlogMutations } from "../hooks/useBlogs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RestrictedButton, RestrictedDeleteButton } from "@/components/shared/Restricted";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageTransition from "@/components/shared/PageTransition";

export default function ListBlogs() {
    const { blogs, isLoading } = useBlogs();
    const { remove } = useBlogMutations();
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
                    title="Blogs"
                    description="Manage your blog posts."
                    actions={
                        <Link to="/cms/blogs/new">
                            <RestrictedButton title="Superadmins only">
                                <Plus className="mr-2 h-4 w-4" /> Create Blog
                            </RestrictedButton>
                        </Link>
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader columns={["Title", "Slug", "Created", "Actions"]} />
                        <tbody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No blogs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog._id}>
                                        <TableCell className="font-medium">
                                            {blog.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {blog.slug}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(blog.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link to={`/cms/blogs/${blog._id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <RestrictedDeleteButton
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(blog._id)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </RestrictedDeleteButton>
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
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete the blog post."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={handleDelete}
                />
            </PageContainer>
        </PageTransition>
    );
}
