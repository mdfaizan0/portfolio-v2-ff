import { hardLogout } from "@/lib/auth/hardLogout"
import { decodeToken, getToken, isExpired, removeToken, saveToken } from "@/lib/auth/token"
import { useCallback, useState } from "react"

function getAuthState() {
    const token = getToken()

    if (!token) {
        // Will be changing false, after integrating auth
        return { admin: null, isAuthenticated: false }
    }

    if (isExpired(token)) {
        hardLogout()
        return { admin: null, isAuthenticated: false }
    }

    const decoded = decodeToken(token)

    if (!decoded) {
        hardLogout()
        return { admin: null, isAuthenticated: false }
    }

    const { id, username, email, role } = decoded

    return {
        admin: { id, username, email, role },
        isAuthenticated: true
    }
}

export function useAuth() {
    const [{ admin, isAuthenticated }, setAuth] = useState(getAuthState)

    const login = useCallback((token) => {
        saveToken(token)
        const decoded = decodeToken(token)

        if (!decoded) {
            hardLogout()
            return
        }

        const { id, email, username, role } = decoded

        setAuth({
            admin: { id, email, username, role },
            isAuthenticated: true
        })
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setAuth({ admin: null, isAuthenticated: false })
        hardLogout()
    }, [])

    const isSuperAdmin = useCallback(() => {
        return admin.role === "superadmin"
    }, [admin])

    return {
        admin,
        isAuthenticated,
        login,
        logout,
        isSuperAdmin
    }
}