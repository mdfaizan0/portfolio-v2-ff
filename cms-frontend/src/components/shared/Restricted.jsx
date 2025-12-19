import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";

/**
 * Checks if the current user has the required role ("superadmin").
 * Returns { isAllowed, isAdmin, isSuperAdmin }
 */
export const useRestriction = () => {
    const { admin } = useAuth();
    const isSuperAdmin = admin?.role === "superadmin";
    // Assuming 'admin' role exists, but for now we basically check vs superadmin
    return { isSuperAdmin };
};

/**
 * RestrictedButton
 * - If user IS superadmin: Renders normal button.
 * - If user IS NOT superadmin: Renders disabled button with tooltip.
 */
export function RestrictedButton({ children, title = "Superadmin only", className, ...props }) {
    const { isSuperAdmin } = useRestriction();

    if (isSuperAdmin) {
        return (
            <Button className={className} {...props}>
                {children}
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {/* Wrap in span because disabled elements don't fire events in some browsers */}
                    <span tabIndex={0} className="inline-flex cursor-not-allowed">
                        <Button disabled className={`${className} opacity-50`} {...props}>
                            {children} <Lock className="ml-2 h-3 w-3" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

/**
 * RestrictedDeleteButton
 * - If user IS superadmin: Renders the button (usually destructive).
 * - If user IS NOT superadmin: Renders null (hidden).
 */
export function RestrictedDeleteButton({ children, className, ...props }) {
    const { isSuperAdmin } = useRestriction();

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <Button variant="destructive" className={className} {...props}>
            {children}
        </Button>
    );
}

/**
 * RestrictedWrapper
 * - Generic wrapper to hide content for non-superadmins.
 */
export function RestrictedWrapper({ children }) {
    const { isSuperAdmin } = useRestriction();

    if (!isSuperAdmin) {
        return null;
    }

    return <>{children}</>;
}
