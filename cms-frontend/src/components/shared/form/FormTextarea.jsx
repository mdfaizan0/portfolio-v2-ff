import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import FormField from './FormField';
import { cn } from "@/lib/utils";

const FormTextarea = ({
    label,
    error,
    required = false,
    className,
    disabled,
    id,
    ...props
}) => {
    return (
        <FormField label={label} error={error} required={required} className={className}>
            <Textarea
                id={id}
                disabled={disabled}
                className={cn("min-h-[100px]", error && "border-destructive focus-visible:ring-destructive")}
                {...props}
            />
        </FormField>
    );
};

export default FormTextarea;
