"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { marketingNav } from "@/lib/navigation";
import { BrandMark } from "./app-sidebar";
import { ThemeToggle } from "./theme-toggle";

export function MarketingNavbar() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    React.useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b transition-colors duration-200",
                scrolled || open
                    ? "border-line bg-surface/90 backdrop-blur-md"
                    : "border-transparent bg-transparent"
            )}
        >
            <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
                <Link href="/" className="flex min-w-0 shrink items-center gap-2.5">
                    <BrandMark />
                    <span className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-tight tracking-tight text-fg">
                            TN LifeBlood
                        </span>
                        <span className="hidden text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-fg-subtle sm:block">
                            Namakkal District
                        </span>
                    </span>
                </Link>

                <nav
                    aria-label="Public sections"
                    className="ml-6 hidden items-center gap-1 lg:flex"
                >
                    {marketingNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-3 py-2 text-[13px] font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />

                    <Link
                        href="/dashboard"
                        className="hidden h-9 items-center rounded-lg border border-line bg-surface px-3.5 text-[13px] font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-hover sm:inline-flex"
                    >
                        Workspace
                    </Link>

                    <Link
                        href="/request"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[13px] font-medium text-brand-fg shadow-sm transition-colors hover:bg-brand-hover sm:px-3.5"
                    >
                        <span className="sm:hidden">Request</span>
                        <span className="hidden sm:inline">Request blood</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg lg:hidden"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? (
                            <X className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Menu className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden border-t border-line bg-surface lg:hidden"
                    >
                        <nav
                            aria-label="Public sections"
                            className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6"
                        >
                            {marketingNav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                            >
                                Workspace
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
