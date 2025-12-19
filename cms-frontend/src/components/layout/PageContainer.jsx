
import React from 'react';

/**
 * PageContainer - Standardizes the max-width and centering for CMS pages.
 * 
 * @param {React.ReactNode} children - The page content.
 */
export default function PageContainer({ children }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}
