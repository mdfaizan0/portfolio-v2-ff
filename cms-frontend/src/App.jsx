import { Toaster } from "./components/ui/sonner"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Outlet } from "react-router-dom"

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <Outlet />
    </ThemeProvider>
  )
}

export default App