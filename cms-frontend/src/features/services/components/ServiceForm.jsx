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

export default function ServiceForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    // Cleanup Hook
    const { handleUploadComplete, setSubmitted, deleteIfTracked } = useUploadCleanup();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        price: '',
    });

    // Store preview URL separately
    const [imagePreview, setImagePreview] = useState(null);

    // Load initial data
    useEffect(() => {
        if (initialData) {
            // Set preview URL from backend
            if (initialData.image?.url) {
                setImagePreview(initialData.image.url);
            }

            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                image: initialData.image?.path || '',
                price: initialData.price || '',
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!canSubmit) return;

        setLoading(true);
        setSubmitted();

        // Prepare data (exclude price if empty)
        const submitData = {
            title: formData.title,
            description: formData.description,
            image: formData.image,
        };

        if (formData.price) {
            submitData.price = Number(formData.price);
        }

        await onSubmit(submitData);
        setLoading(false);
    };

    const canSubmit = formData.title && formData.description && formData.image;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            {/* Header with Back Button and Save */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/services">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Service' : 'Create New Service'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Update Service' : 'Create Service'}
                    </RestrictedButton>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left: Service Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                            <CardDescription>Enter service information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormInput
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Service Title"
                                required
                                disabled={!isSuperAdmin}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Description <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Service description"
                                    required
                                    disabled={!isSuperAdmin}
                                    rows={6}
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                />
                            </div>

                            <FormInput
                                label="Price (Optional)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                placeholder="0.00"
                                disabled={!isSuperAdmin}
                                min="0"
                                step="0.01"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Image Upload */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Image</CardTitle>
                            <CardDescription>Upload service image</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                value={formData.image}
                                onChange={(path) => handleChange('image', path)}
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
