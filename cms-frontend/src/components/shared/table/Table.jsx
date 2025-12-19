import React from 'react';
import { cn } from "@/lib/utils";

const Table = React.forwardRef(({ className, children, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-md border bg-card">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        >
            {children}
        </table>
    </div>
));
Table.displayName = "Table";

export default Table;
