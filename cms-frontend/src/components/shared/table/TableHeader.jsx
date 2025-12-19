import React from 'react';
import { cn } from "@/lib/utils";

const TableHeader = ({ columns, className }) => {
    return (
        <thead className={cn("[&_tr]:border-b bg-muted/50", className)}>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((col, index) => (
                    <th
                        key={index}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;
