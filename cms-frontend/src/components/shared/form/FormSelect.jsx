import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import FormField from './FormField';
import { cn } from "@/lib/utils";

const FormSelect = ({
    label,
    error,
    required = false,
    className,
    value,
    onValueChange,
    placeholder = "Select an option",
    options = [],
    disabled
}) => {
    return (
        <FormField label={label} error={error} required={required} className={className}>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger className={cn(error && "border-destructive focus:ring-destructive")}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                    {options.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                            No options available
                        </div>
                    )}
                </SelectContent>
            </Select>
        </FormField>
    );
};

export default FormSelect;
