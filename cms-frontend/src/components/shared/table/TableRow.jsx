import React from 'react';
import { cn } from "@/lib/utils";

const TableRow = ({ children, className, onClick, disabled, ...props }) => {
    return (
        <tr
            className={cn(
                "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                onClick && !disabled && "cursor-pointer",
                disabled && "opacity-50 pointer-events-none bg-muted/30",
                className
            )}
            onClick={!disabled ? onClick : undefined}
            {...props}
        >
            {children}
        </tr>
    );
};

export default TableRow;
