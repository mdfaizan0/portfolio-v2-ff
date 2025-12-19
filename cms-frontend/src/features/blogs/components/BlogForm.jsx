import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormInput from "@/components/shared/form/FormInput";
import ImageUploader from "@/components/shared/ImageUploader";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";

import { useUploadCleanup } from "@/hooks/useUploadCleanup";

export default function BlogForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    // Cleanup Hook
    const { handleUploadComplete, setSubmitted, deleteIfTracked } = useUploadCleanup();

    // Store initial URL for preview in case we don't change the image
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        coverImage: '',
        markdownContent: '',
    });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setCoverImagePreview(initialData.coverImage?.url || null);
            setFormData({
                title: initialData.title || '',
                // Backend sends { path, url }, we store path for submission
                coverImage: initialData.coverImage?.path || '',
                // Markdown content from backend is string (or empty)
                markdownContent: initialData.markdownContent || '',
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final Validation
        if (!canSubmit) return;

        setLoading(true);
        // Mark as submitted to prevent cleanup
        setSubmitted();

        await onSubmit(formData);
        setLoading(false);
    };

    const canSubmit = formData.title && formData.coverImage && formData.markdownContent;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/blogs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? `Edit Blog` : "Create New Blog"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? "Update Blog" : "Create Blog"}
                    </RestrictedButton>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Main Content: Title & Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormInput
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Blog Title"
                                required
                            />

                            <div className="space-y-2">
                                <MarkdownEditor
                                    value={formData.markdownContent}
                                    onChange={(val) => handleChange('markdownContent', val)}
                                    title={formData.title}
                                    required
                                    isBlog
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Meta & Media */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                            <CardDescription>Primary visual for the blog card</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                label="Cover Image"
                                folder="blogs/covers"
                                value={formData.coverImage}
                                onChange={(path) => handleChange('coverImage', path)}
                                disabled={!isSuperAdmin}
                                previewUrl={formData.coverImage === initialData?.coverImage?.path ? coverImagePreview : null}
                                onUploadComplete={handleUploadComplete}
                                onImageDelete={deleteIfTracked}
                            />
                        </CardContent>
                    </Card>

                    {/* Tip Card */}
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-base">Writing Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>• Use <code>#</code> for H1, <code>##</code> for H2.</p>
                            <p>• Links: <code>[text](url)</code></p>
                            <p>• The excerpt is automatically generated from the first 150 chars.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
