import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => (localStorage.getItem("cms-theme") || "dark"))

    useEffect(() => {
        const root = document.documentElement

        if (theme === "dark") {
            root.classList.add("dark")
            root.classList.remove("light")
        } else {
            root.classList.remove("dark")
            root.classList.add("light")
        }

        localStorage.setItem("cms-theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext)
}