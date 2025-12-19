import { Outlet, NavLink } from 'react-router-dom';

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-(--bg) text-(--text-primary)">
            {/* Header - Centered & Floating/Sticky */}
            <header className="sticky top-0 z-50 py-4 px-4 flex justify-center">
                <nav className="flex items-center gap-1 p-1 rounded-full bg-(--surface)/80 backdrop-blur-md border border-(--border-muted) shadow-sm">
                    <NavLink to="/" className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-(--text-primary) text-(--bg)" : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-hover)"}`}>Home</NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-(--text-primary) text-(--bg)" : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-hover)"}`}>Projects</NavLink>
                    <NavLink to="/blogs" className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-(--text-primary) text-(--bg)" : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-hover)"}`}>Writing</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => `px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-(--text-primary) text-(--bg)" : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-hover)"}`}>Contact</NavLink>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-(--border-muted) py-12 text-center">
                <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                    <div className="text-(--text-tertiary) text-sm">
                        © {new Date().getFullYear()} Designed & Built by Md Faizan.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MainLayout;
