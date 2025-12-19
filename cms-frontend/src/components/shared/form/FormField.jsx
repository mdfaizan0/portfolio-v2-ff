import React from 'react';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FormField = ({
    label,
    error,
    required = false,
    className,
    children
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label className={cn(error && "text-destructive", "flex items-center gap-1")}>
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            {children}

            {error && (
                <p className="text-sm font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
