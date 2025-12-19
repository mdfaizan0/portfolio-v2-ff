
import React from 'react';

/**
 * PageHeader - Standardized page heading for CMS screens.
 * 
 * @param {string} title - Main page title (required).
 * @param {string} description - Optional description text below the title.
 * @param {React.ReactNode} actions - Optional actions (buttons, etc.) to display on the right.
 */
export default function PageHeader({ title, description, actions }) {
    return (
        <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
