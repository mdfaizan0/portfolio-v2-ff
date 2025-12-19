import { useAuth } from "@/hooks/useAuth"
import { hardLogout } from "@/lib/auth/hardLogout";
import { getToken, isExpired } from "@/lib/auth/token";
import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const token = getToken();
    if (!token || isExpired(token)) {
        hardLogout();
        return <Navigate to="/login" replace />;
    }

    return <Outlet />
}

export function SuperAdminRoute() {
    const { isAuthenticated, isSuperAdmin } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isSuperAdmin()) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}