import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormInput from "@/components/shared/form/FormInput";
import ImageUploader from "@/components/shared/ImageUploader";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUploadCleanup } from "@/hooks/useUploadCleanup";
import { resolveSocialIcon } from "../utils/socialIconResolver";
import { Skeleton } from "@/components/ui/skeleton";
import { RestrictedButton, useRestriction } from '@/components/shared/Restricted';

// Sub-component for individual social link row to handle own debounce state
const SocialLinkRow = ({ link, index, onUpdate, onRemove }) => {
    const [iconObj, setIconObj] = useState(null);
    const [isResolvingIcon, setIsResolvingIcon] = useState(false);

    // Debounced icon resolution - Replicating SkillForm logic
    useEffect(() => {
        if (!link.name) {
            setIconObj(null);
            return;
        }

        setIsResolvingIcon(true);
        const timer = setTimeout(() => {
            const icon = resolveSocialIcon(link.name);
            setIconObj(icon);
            setIsResolvingIcon(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [link.name]);

    return (
        <div className="flex justify-center gap-4 items-center p-4 border rounded-lg bg-muted/20">
            <div className="mt-2 w-10 h-10 flex items-center justify-center bg-background rounded-md border shrink-0">
                {isResolvingIcon ? (
                    <Skeleton className="w-6 h-6 rounded-sm" />
                ) : iconObj ? (
                    <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill={`#${iconObj.hex}`}
                    >
                        <path d={iconObj.path} />
                    </svg>
                ) : (
                    <span className="text-xs text-muted-foreground">?</span>
                )}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    placeholder="Platform (e.g. GitHub)"
                    value={link.name}
                    onChange={(e) => onUpdate(index, 'name', e.target.value)}
                    required
                />
                <FormInput
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => onUpdate(index, 'url', e.target.value)}
                    required
                />
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90 mt-1"
                onClick={() => onRemove(index)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default function AboutForm({ initialData, onSubmit, isEditing = false }) {
    const [loading, setLoading] = useState(false);

    // Cleanup Hook
    const { handleUploadComplete, setSubmitted, deleteIfTracked } = useUploadCleanup();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        profileImage: '',
        resumeUrl: '',
        socialLinks: [] // { name, url }
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Load initial data
    useEffect(() => {
        if (initialData) {
            if (initialData.profileImage?.url) {
                setImagePreview(initialData.profileImage.url);
            }

            setFormData({
                name: initialData.name || '',
                role: initialData.role || '',
                bio: initialData.bio || '',
                profileImage: initialData.profileImage?.path || '',
                resumeUrl: initialData.resumeUrl || '',
                socialLinks: initialData.socialLinks || []
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Social Links Handlers
    const addSocialLink = () => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { name: '', url: '' }]
        }));
    };

    const removeSocialLink = (index) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const updateSocialLink = (index, field, value) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) return;

        setLoading(true);
        setSubmitted();

        try {
            // Normalize social links names using icon titles to ensure consistency
            const normalizedSocialLinks = formData.socialLinks.map(link => {
                const icon = resolveSocialIcon(link.name);
                return {
                    name: icon ? icon.title : link.name,
                    url: link.url
                };
            });

            const submissionData = {
                ...formData,
                socialLinks: normalizedSocialLinks
            };

            await onSubmit(submissionData);
        } catch (error) {
            console.error("Submit error", error);
        } finally {
            setLoading(false);
        }
    };

    const { isSuperAdmin } = useRestriction();
    const canSubmit = formData.name && formData.role && formData.bio && formData.profileImage &&
        formData.socialLinks.every(link => link.name && link.url) && isSuperAdmin;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/about">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Profile' : 'Create Profile'}
                    </h1>
                </div>
                <RestrictedButton
                    type="submit"
                    disabled={!canSubmit || loading}
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Save Changes' : 'Create Profile'}
                </RestrictedButton>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Primary details about you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    placeholder="e.g. John Doe"
                                />
                                <FormInput
                                    label="Role / Title"
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    required
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Biography <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    placeholder="Tell your story..." // Editorial feel
                                    required
                                    rows={8}
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <FormInput
                                label="Resume URL (Optional)"
                                value={formData.resumeUrl}
                                onChange={(e) => handleChange('resumeUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </CardContent>
                    </Card>

                    {/* Social Links Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Social Presence</CardTitle>
                                <CardDescription>Where people can find you.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                                <Plus className="h-4 w-4 mr-2" /> Add Link
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.socialLinks.length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-4 italic">
                                    No social links added yet.
                                </div>
                            )}
                            {formData.socialLinks.map((link, index) => (
                                <SocialLinkRow
                                    key={index}
                                    link={link}
                                    index={index}
                                    onUpdate={updateSocialLink}
                                    onRemove={removeSocialLink}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Profile Image */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                            <CardDescription>Your main display image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                value={formData.profileImage}
                                onChange={(path) => handleChange('profileImage', path)}
                                previewUrl={imagePreview}
                                onUploadComplete={handleUploadComplete}
                                onImageDelete={deleteIfTracked}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
