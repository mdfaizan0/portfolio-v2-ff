
import React from 'react';

/**
 * Section - Semantic grouping wrapper for forms or content blocks.
 * 
 * @param {string} title - Optional section title.
 * @param {string} description - Optional section description.
 * @param {React.ReactNode} children - The section content.
 */
export default function Section({ title, description, children }) {
    return (
        <section className="py-4">
            {(title || description) && (
                <div className="mb-4 space-y-1">
                    {title && (
                        <h3 className="text-lg font-medium leading-6 text-foreground">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
}
