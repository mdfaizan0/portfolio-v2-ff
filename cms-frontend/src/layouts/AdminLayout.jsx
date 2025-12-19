import Sidebar from "@/components/shared/sidebar/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    const [sidebarState, setSidebarState] = useState(() => {
        return localStorage.getItem("cms-sidebar") || "expanded"
    })

    const isCollapsed = sidebarState === "collapsed"

    const toggleSidebar = () => {
        const next = isCollapsed ? "expanded" : "collapsed"
        setSidebarState(next)
        localStorage.setItem("cms-sidebar", next)
    }

    return (
        <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
            <div className="flex h-full">
                <aside
                    className={`
                    ${isCollapsed ? "w-[60px]" : "w-[260px]"}
                    h-full
                    bg-sidebar
                    border-r
                    border-sidebar-border
                    shrink-0
                    transition-[width]
                    duration-200
                    `}
                >
                    <Sidebar collapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                </aside>

                <div className="flex flex-col flex-1 h-full min-w-0">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background admin-main-scroll p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}