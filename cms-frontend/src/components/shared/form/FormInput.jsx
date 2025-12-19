import React from 'react';
import { Input } from "@/components/ui/input";
import FormField from './FormField';
import { cn } from "@/lib/utils";

const FormInput = ({
    label,
    error,
    required = false,
    className,
    disabled,
    id, // Allow passing specific ID, otherwise undefined
    ...props
}) => {
    return (
        <FormField label={label} error={error} required={required} className={className}>
            <Input
                id={id}
                disabled={disabled}
                className={cn(error && "border-destructive focus-visible:ring-destructive")}
                {...props}
            />
        </FormField>
    );
};

export default FormInput;
