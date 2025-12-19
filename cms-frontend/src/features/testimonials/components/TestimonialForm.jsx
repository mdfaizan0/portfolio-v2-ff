import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormInput from "@/components/shared/form/FormInput";
import ImageUploader from "@/components/shared/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";
import { useUploadCleanup } from "@/hooks/useUploadCleanup";

export default function TestimonialForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    // Cleanup Hook
    const { handleUploadComplete, setSubmitted, deleteIfTracked } = useUploadCleanup();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        quote: '',
        designation: '',
        avatar: '',
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            if (initialData.avatar?.url) {
                setImagePreview(initialData.avatar.url);
            }
            setFormData({
                name: initialData.name || '',
                quote: initialData.quote || '',
                designation: initialData.designation || '',
                avatar: initialData.avatar?.path || '',
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setSubmitted();

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Submit error", error);
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = formData.name && formData.quote && formData.avatar;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/testimonials">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Testimonial' : 'Create Testimonial'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Update Testimonial' : 'Create Testimonial'}
                    </RestrictedButton>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Testimonial Details</CardTitle>
                            <CardDescription>Client name and feedback</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Client Name"
                                    required
                                    disabled={!isSuperAdmin}
                                />
                                <FormInput
                                    label="Designation (Optional)"
                                    value={formData.designation}
                                    onChange={(e) => handleChange('designation', e.target.value)}
                                    placeholder="e.g. CEO @ Company"
                                    disabled={!isSuperAdmin}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Quote <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={formData.quote}
                                    onChange={(e) => handleChange('quote', e.target.value)}
                                    placeholder="What they see about us..."
                                    required
                                    disabled={!isSuperAdmin}
                                    rows={5}
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Avatar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Avatar</CardTitle>
                            <CardDescription>Upload client photo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                value={formData.avatar}
                                onChange={(path) => handleChange('avatar', path)}
                                previewUrl={imagePreview}
                                onUploadComplete={handleUploadComplete}
                                onImageDelete={deleteIfTracked}
                                disabled={!isSuperAdmin}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
