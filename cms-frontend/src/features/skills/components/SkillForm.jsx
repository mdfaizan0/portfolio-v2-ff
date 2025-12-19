import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/shared/form/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RestrictedButton } from "@/components/shared/Restricted";
import { resolveSkillIcon } from "../utils/iconResolver";

const SKILL_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

export default function SkillForm({ initialData, onSubmit, isEditing = false }) {
    const { isSuperAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        icon: '', // Will store the skill name optimistically
    });

    // Icon preview state
    const [iconObj, setIconObj] = useState(null);
    const [isResolvingIcon, setIsResolvingIcon] = useState(false);

    // Load initial data for edit mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                level: initialData.level || '',
                icon: initialData.name || '', // Optimistically set icon to name
            });
        }
    }, [initialData]);

    // Debounced icon resolution
    useEffect(() => {
        if (!formData.name) {
            setIconObj(null);
            return;
        }

        setIsResolvingIcon(true);
        const timer = setTimeout(() => {
            const icon = resolveSkillIcon(formData.name);
            setIconObj(icon);
            setIsResolvingIcon(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [formData.name]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Update icon field optimistically when name changes
        if (field === 'name') {
            setFormData(prev => ({ ...prev, icon: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.level) {
            return;
        }

        setLoading(true);

        // Determine icon value and name
        let iconValue = formData.name;
        let skillName = formData.name;

        if (iconObj && iconObj.slug) {
            iconValue = `si${iconObj.slug.charAt(0).toUpperCase() + iconObj.slug.slice(1)}`;
            skillName = iconObj.title; // Use icon title as skill name (e.g., "React", "Node.js")
        }

        // Submit with icon title as name
        await onSubmit({
            name: skillName,
            level: formData.level,
            icon: iconValue
        });
        setLoading(false);
    };

    const canSubmit = formData.name && formData.level;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            {/* Header with Back Button and Save */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/cms/skills">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Skill' : 'Create New Skill'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <RestrictedButton
                        type="submit"
                        disabled={!canSubmit || loading}
                        title="Superadmins only"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Update Skill' : 'Create Skill'}
                    </RestrictedButton>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Left: Skill Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Details</CardTitle>
                            <CardDescription>Enter the skill name and proficiency level</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 min-h-[200px]">
                            <FormInput
                                label="Skill Name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="React, Node.js, MongoDB"
                                required
                                disabled={!isSuperAdmin}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Level <span className="text-destructive">*</span>
                                </label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => handleChange('level', value)}
                                    disabled={!isSuperAdmin}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select proficiency level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SKILL_LEVELS.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Icon Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Icon Preview</CardTitle>
                            <CardDescription>Auto-resolved from skill name</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-center min-h-[200px] p-8 border rounded-lg bg-muted/20">
                                {isResolvingIcon ? (
                                    <Skeleton className="w-20 h-20 rounded-md bg-muted-foreground/20" />
                                ) : iconObj ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <svg
                                            role="img"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-20 h-20"
                                            fill={`#${iconObj.hex}`}
                                        >
                                            <title>{iconObj.title}</title>
                                            <path d={iconObj.path} />
                                        </svg>
                                        <p className="text-sm text-muted-foreground">{iconObj.title}</p>
                                    </div>
                                ) : formData.name ? (
                                    <p className="text-sm text-muted-foreground">No icon found</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Enter a skill name</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
