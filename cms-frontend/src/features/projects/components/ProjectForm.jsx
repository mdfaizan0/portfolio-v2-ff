import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormInput from "@/components/shared/form/FormInput";
import FormTextarea from "@/components/shared/form/FormTextarea";
import ImageUploader from "@/components/shared/ImageUploader";
import GalleryManager from "@/components/shared/GalleryManager";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RestrictedButton } from "@/components/shared/Restricted";
import { useUploadCleanup } from "@/hooks/useUploadCleanup";

export default function ProjectForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // Cleanup Hook
    const { handleUploadComplete, setSubmitted, deleteIfTracked } = useUploadCleanup();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        images: [],
        technologies: '', // String for input, converted to array on submit
        liveURL: '',
        sourceURL: '',
        featured: false
    });

    // Load initial data
    useEffect(() => {
        if (initialData) {
            setThumbnailPreview(initialData.thumbnail?.url || null);
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                thumbnail: initialData.thumbnail?.path || '', // Backend sends object { path, url }
                images: initialData.images || [], // Contains { path, order, url }
                technologies: Array.isArray(initialData.technologies)
                    ? initialData.technologies.join(', ')
                    : initialData.technologies || '',
                liveURL: initialData.liveURL || '',
                sourceURL: initialData.sourceURL || '',
                featured: initialData.featured || false
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final Validation
        if (!formData.title || !canSubmit) {
            return;
        }

        setLoading(true);

        // Transform Data
        const payload = {
            ...formData,
            // Clean images array (remove url, etc)
            images: formData.images.map(img => ({ path: img.path, order: img.order })),
            // Convert comma-separated string to array
            technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        };

        // Mark as submitted to prevent cleanup
        setSubmitted();

        await onSubmit(payload);
        setLoading(false);
    };

    const canSubmit = formData.title && formData.thumbnail;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/projects">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? `Edit Project` : "Create New Project"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? "Update Project" : "Create Project"}
                    </RestrictedButton>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormInput
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Project Title"
                                required
                            />

                            <FormTextarea
                                label="Description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Project Description"
                                required
                                className="min-h-[150px]"
                            />

                            <FormInput
                                label="Technologies (comma separated)"
                                value={formData.technologies}
                                onChange={(e) => handleChange('technologies', e.target.value)}
                                placeholder="React, Node.js, MongoDB"
                                required
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Links & Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormInput
                                label="Live URL"
                                value={formData.liveURL}
                                onChange={(e) => handleChange('liveURL', e.target.value)}
                                placeholder="https://example.com"
                                type="url"
                                required
                            />
                            <FormInput
                                label="Source Code URL"
                                value={formData.sourceURL}
                                onChange={(e) => handleChange('sourceURL', e.target.value)}
                                placeholder="https://github.com/user/repo"
                                type="url"
                                required
                            />

                            <div className="flex items-center justify-between border p-4 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Featured Project</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show this project on the homepage
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => handleChange('featured', checked)}
                                    disabled={!isSuperAdmin}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>Upload visuals for your project</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ImageUploader
                                label="Thumbnail Image *"
                                folder="projects/thumbnails"
                                value={formData.thumbnail}
                                onChange={(path) => handleChange('thumbnail', path)}
                                disabled={!isSuperAdmin}
                                previewUrl={formData.thumbnail === initialData?.thumbnail?.path ? thumbnailPreview : null}
                                onUploadComplete={handleUploadComplete}
                                onImageDelete={deleteIfTracked}
                            />

                            <div className="border-t pt-6">
                                <GalleryManager
                                    label="Project Gallery"
                                    folder="projects/gallery"
                                    value={formData.images}
                                    onChange={(newImages) => handleChange('images', newImages)}
                                    disabled={!isSuperAdmin}
                                    onUploadComplete={handleUploadComplete}
                                    onImageDelete={deleteIfTracked}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
