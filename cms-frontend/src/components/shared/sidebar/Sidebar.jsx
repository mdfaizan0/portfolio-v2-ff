import {
    PanelRightClose,
    PanelRightOpen,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { NAV_ITEMS } from "@/config/navigation";


function Sidebar({ collapsed, toggleSidebar }) {
    return (
        <nav className="h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <button
                className="m-2 rounded-md p-2 text-xs cursor-pointer hover:bg-sidebar-accent/50 transition-colors"
                onClick={toggleSidebar}
            >
                {collapsed ? <PanelRightOpen /> : <PanelRightClose />}
            </button>
            <ul className="py-3">
                {NAV_ITEMS.map(item => (
                    <SidebarItem key={item.path} {...item} collapsed={collapsed} />
                ))}
            </ul>
        </nav>
    )
}

export default Sidebar