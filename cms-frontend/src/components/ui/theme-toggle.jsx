import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden p-2 bg-card hover:bg-muted transition cursor-pointer"
    >
      {/* Sun Icon */}
      <Sun
        className={`
          h-5 w-5 text-foreground transition-all duration-300
          ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}
        `}
      />

      {/* Moon Icon */}
      <Moon
        className={`
          absolute h-5 w-5 text-foreground transition-all duration-300
          ${theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"}
        `}
      />
    </Button>
  );
}