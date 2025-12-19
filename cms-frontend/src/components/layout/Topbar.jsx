import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Topbar() {
    const location = useLocation();

    // Find current active item
    const currentItem = NAV_ITEMS.find(item => location.pathname.startsWith(item.path));
    const title = currentItem ? currentItem.label : "CMS Panel";

    const { logout, admin } = useAuth();
    const [user, setUser] = useState({ name: "", role: "" });

    // Persist user details so they don't flicker on logout
    useEffect(() => {
        if (admin) {
            setUser({
                name: admin.username,
                role: admin.role
            });
        }
    }, [admin]);

    return (
        <header className="h-14 bg-background/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-200">
            {/* Left side - Dynamic Page Title */}
            <div className="font-semibold text-lg tracking-tight">
                {title}
            </div>

            {/* Right side - User Actions */}
            <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex flex-col items-end text-sm">
                    <span className="font-medium text-foreground leading-none">{user.name}</span>
                    <span className="text-muted-foreground text-xs mt-1">{user.role}</span>
                </div>

                {/* Separator */}
                <div className="h-8 w-px bg-border mx-1" />

                <ThemeToggle />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
