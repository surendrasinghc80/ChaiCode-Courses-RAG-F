"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "", variant = "ghost", size = "sm" }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant={variant}
                size={size}
                className={`h-9 w-9 px-0 ${className}`}
                disabled
            >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant={variant}
            size={size}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`h-9 w-9 px-0 ${className}`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
            }`} />
            <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
            }`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
