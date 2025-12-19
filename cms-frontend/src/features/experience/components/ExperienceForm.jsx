import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FormInput from "@/components/shared/form/FormInput";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";

export default function ExperienceForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                role: initialData.role || '',
                company: initialData.company || '',
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
                description: initialData.description || '',
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

        // Handle empty endDate for current role (send null or undefined if empty string)
        const submitData = {
            ...formData,
            endDate: formData.endDate || null
        };

        try {
            await onSubmit(submitData);
        } catch (error) {
            console.error("Submit error", error);
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = formData.role && formData.company && formData.startDate && formData.description;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/experience">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Experience' : 'Add Experience'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Update Experience' : 'Initialise Experience'}
                    </RestrictedButton>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                        <CardDescription>Enter your work history</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Role/Title"
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                placeholder="e.g. Senior Developer"
                                required
                                disabled={!isSuperAdmin}
                            />
                            <FormInput
                                label="Company"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                placeholder="e.g. Google"
                                required
                                disabled={!isSuperAdmin}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                required
                                disabled={!isSuperAdmin}
                            />
                            <FormInput
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                placeholder="Leave empty if current role"
                                disabled={!isSuperAdmin}
                                description="Leave empty if this is your current role"
                            />
                        </div>

                        <div className="space-y-2">
                            <MarkdownEditor
                                label="Description"
                                value={formData.description}
                                onChange={(val) => handleChange('description', val)}
                                title={formData.role}
                                disabled={!isSuperAdmin}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
