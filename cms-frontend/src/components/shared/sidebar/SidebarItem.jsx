import { NavLink } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// eslint-disable-next-line no-unused-vars
function SidebarItem({ label, path, icon: Icon, collapsed }) {
    return (
        <li>
            <NavLink to={path}>
                {({ isActive }) => {
                    const content = (
                        <div
                            className={[
                                "group relative mx-2 my-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "hover:bg-sidebar-accent/50",
                            ].join(" ")}
                        >
                            <span
                                className={`
                                absolute left-0 top-1/2 -translate-y-1/2
                                h-5 w-1 rounded-r bg-sidebar-primary
                                ${isActive ? "opacity-100" : "opacity-0"}
                                `}
                            />

                            <Icon className="h-4 w-4 shrink-0" />

                            {!collapsed && (
                                <span className="relative z-10 truncate">
                                    {label}
                                </span>
                            )}
                        </div>
                    );

                    return collapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                            <TooltipContent side="right" align="center">
                                {label}
                            </TooltipContent>
                        </Tooltip>
                    ) : (content);
                }}
            </NavLink>
        </li>
    );
}

export default SidebarItem;