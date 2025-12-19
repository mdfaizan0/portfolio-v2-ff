import React from 'react';
import { cn } from "@/lib/utils";

const TableCell = ({ children, className, align = 'left', truncate = false, ...props }) => {
    return (
        <td
            className={cn(
                "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                align === 'center' && "text-center",
                align === 'right' && "text-right",
                truncate && "truncate max-w-[200px]", // Default reasonable max-width for truncate
                className
            )}
            {...props}
        >
            {children}
        </td>
    );
};

export default TableCell;
