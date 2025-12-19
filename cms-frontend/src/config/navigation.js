import {
    Briefcase,
    FileText,
    Folder,
    LayoutDashboard,
    Quote,
    Star,
    User,
    Wrench
} from "lucide-react";

export const NAV_ITEMS = [
    { label: "Dashboard", path: "/cms/dashboard", icon: LayoutDashboard },
    { label: "About", path: "/cms/about", icon: User },
    { label: "Projects", path: "/cms/projects", icon: Folder },
    { label: "Blogs", path: "/cms/blogs", icon: FileText },
    { label: "Skills", path: "/cms/skills", icon: Star },
    { label: "Services", path: "/cms/services", icon: Wrench },
    { label: "Experience", path: "/cms/experience", icon: Briefcase },
    { label: "Testimonials", path: "/cms/testimonials", icon: Quote },
];
