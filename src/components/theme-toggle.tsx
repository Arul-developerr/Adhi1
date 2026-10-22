"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted",
                "transition-[background-color,border-color,color] duration-150",
                "hover:border-line-strong hover:bg-surface-hover hover:text-fg",
                className
            )}
            aria-label={
                mounted
                    ? `Switch to ${isDark ? "light" : "dark"} theme`
                    : "Switch theme"
            }
            title={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Switch theme"}
        >
            {mounted && isDark ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
            )}
        </button>
    );
}
