import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useAbout, useAboutMutations } from "../hooks/useAbout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Edit, ExternalLink, Trash2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import React, { useState } from 'react';
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import PageTransition from "@/components/shared/PageTransition";

export default function ViewAbout() {
    const { about, isLoading, isError } = useAbout();
    const { remove } = useAboutMutations();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // State 2: Error or Empty (404 typically handled by hook returning null or empty)
    if (!about || (isError && isError.response?.status === 404)) {
        return (
            <PageTransition>
                <PageContainer>
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">About Information</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                You haven't set up your profile information yet. Add your details to display them on the portfolio.
                            </p>
                        </div>
                        <Link to="/cms/about/new">
                            <Button size="lg">
                                <Plus className="mr-2 h-4 w-4" /> Create Profile
                            </Button>
                        </Link>
                    </div>
                </PageContainer>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <PageContainer>
                {/* Page Header */}
                <PageHeader
                    title={about.name}
                    description={about.role}
                    actions={
                        <div className="flex gap-2">
                            <Link to="/cms/about/edit">
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Bio Section */}
                        <Section title="Biography">
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {about.bio}
                                </ReactMarkdown>
                            </div>
                        </Section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Profile Image */}
                        {about.profileImage?.url && (
                            <div className="rounded-xl overflow-hidden border bg-muted shadow-sm aspect-square relative">
                                <img
                                    src={about.profileImage.url}
                                    alt={about.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        {/* Meta Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Resume */}
                                {about.resumeUrl && (
                                    <div>
                                        <span className="text-sm font-medium text-foreground block mb-1">Resume</span>
                                        <a
                                            href={about.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline flex items-center"
                                        >
                                            View Resume <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                )}

                                {/* Social Links */}
                                {about.socialLinks && about.socialLinks.length > 0 && (
                                    <div>
                                        <span className="text-sm font-medium text-foreground block mb-2">Social Links</span>
                                        <ul className="space-y-2">
                                            {about.socialLinks.map((link, i) => (
                                                <li key={i}>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
                                                    >
                                                        {link.name} <ExternalLink className="ml-1 h-3 w-3 opacity-50" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ConfirmDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={remove}
                    title="Delete Profile"
                    description="Are you sure you want to delete your About profile? This action will remove all your data including bio, image, and social links. This cannot be undone."
                    confirmText="Delete Profile"
                    destructive
                />
            </PageContainer>
        </PageTransition>
    );
}
